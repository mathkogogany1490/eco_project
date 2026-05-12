import re

from rapidfuzz import process

COMPANY_LIST = [
    "삼성건설",
    "현대건설",
    "대우건설",
]

VEHICLE_MAP = {
    "덤프": "덤프트럭",
    "오톤": "5톤트럭"
}

KOR_NUM = {
    "한": 1,
    "두": 2,
    "세": 3,
    "네": 4,
    "다섯": 5
}


def normalize_company(name):

    result = process.extractOne(
        name,
        COMPANY_LIST
    )

    if not result:
        return name

    match, score, _ = result

    return match if score > 70 else name


def normalize_vehicle(text):

    for k, v in VEHICLE_MAP.items():

        text = text.replace(k, v)

    return text


def convert_korean_numbers(text):

    for k, v in KOR_NUM.items():

        text = re.sub(
            f"{k}대",
            f"{v}대",
            text
        )

    return text


def preprocess_text_rule(text):

    text = convert_korean_numbers(text)

    text = normalize_vehicle(text)

    return text