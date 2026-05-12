from openai import OpenAI

import os
import json

from datetime import datetime


def refine_and_extract(text):

    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY")
    )

    today = datetime.today().strftime(
        "%Y-%m-%d"
    )

    prompt = f"""
오늘 날짜는 {today} 입니다.

다음 텍스트를 분석하세요.

텍스트:
{text}

JSON만 출력하세요.
"""

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "정보 추출 전문가"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    content = (
        res.choices[0]
        .message
        .content
        .strip()
    )

    try:

        parsed = json.loads(content)

        parsed.setdefault(
            "refined_text",
            text
        )

        parsed.setdefault(
            "dispatch",
            []
        )

        return parsed

    except Exception:

        return {
            "refined_text": text,
            "dispatch": []
        }