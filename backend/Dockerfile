FROM python:3.11-slim

# -----------------------------
# 환경 변수
# -----------------------------
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8

# -----------------------------
# 작업 디렉토리
# -----------------------------
WORKDIR /app

# -----------------------------
# 시스템 패키지
# -----------------------------
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        gcc \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------
# Python 패키지 설치
# -----------------------------
COPY requirements.txt .

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# -----------------------------
# 프로젝트 복사
# -----------------------------
COPY . .

# -----------------------------
# entrypoint script 복사
# -----------------------------
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# -----------------------------
# 포트
# -----------------------------
EXPOSE 8000

# -----------------------------
# 실행
# -----------------------------
ENTRYPOINT ["/entrypoint.sh"]