from openai import OpenAI
from pydub.silence import split_on_silence
from pydub import AudioSegment

import os

from dotenv import load_dotenv

from .classifier import is_dispatch_text
from .audio_preprocess import preprocess_audio
from .utils import (
    preprocess_text_rule,
    normalize_company,
)
from .postprocess import refine_and_extract

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


# ==================================================
# 오디오 분리
# ==================================================
def split_audio(file):

    audio = AudioSegment.from_file(file)

    chunks = split_on_silence(
        audio,
        min_silence_len=300,
        silence_thresh=-35,
        keep_silence=200
    )

    files = []

    for i, chunk in enumerate(chunks):

        name = f"temp_{i}.wav"

        chunk.export(name, format="wav")

        files.append(name)

    return files


# ==================================================
# Whisper STT
# ==================================================
def transcribe(file):

    clean = "temp_clean.wav"

    preprocess_audio(file, clean)

    chunks = split_audio(clean)

    texts = []

    for c in chunks:

        with open(c, "rb") as f:

            res = client.audio.transcriptions.create(
                model="gpt-4o-transcribe",
                file=f,
                response_format="text",
                language="ko"
            )

        if len(res.strip()) > 1:

            texts.append(
                res.strip()
            )

        os.remove(c)

    os.remove(clean)

    raw = " ".join(texts)

    print("\n📄 STT 결과:")
    print(raw)

    # ==================================================
    # 규칙 기반 보정
    # ==================================================
    rule_text = preprocess_text_rule(raw)

    print("\n🛠 규칙 보정:")
    print(rule_text)

    # ==================================================
    # 일반 대화
    # ==================================================
    if not is_dispatch_text(rule_text):

        result = {
            "refined_text": rule_text,
            "dispatch": []
        }

        return result

    # ==================================================
    # 배차 분석
    # ==================================================
    result = refine_and_extract(rule_text)

    # 회사명 보정
    for d in result.get("dispatch", []):

        d["company"] = normalize_company(
            d.get("company", "")
        )

    return result