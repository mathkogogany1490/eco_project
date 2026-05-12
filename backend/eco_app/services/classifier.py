from openai import OpenAI
import os

KEYWORDS = [
    "차",
    "대",
    "트럭",
    "덤프",
    "톤",
    "출발",
    "도착",
    "현장",
    "배차",
]


def quick_rule_check(text: str):

    for kw in KEYWORDS:

        if kw in text:
            return True

    return False


def is_dispatch_text(text: str):

    if not quick_rule_check(text):
        return False

    client = OpenAI(
        api_key=os.getenv("OPENAI_API_KEY")
    )

    prompt = f"""
다음 문장이 차량 배차 관련 내용인지 판단하세요.

반드시 YES 또는 NO만 출력

텍스트:
{text}
"""

    res = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "배차 분류 전문가"
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    result = (
        res.choices[0]
        .message
        .content
        .strip()
    )

    return result.upper().startswith("YES")