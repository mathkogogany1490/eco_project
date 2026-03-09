import jwt
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.hashers import check_password
from rest_framework.exceptions import AuthenticationFailed
from .models import User


# ==================================================
# 비밀번호 검증
# ==================================================

def verify_password(plain_password, hashed_password):
    return check_password(plain_password, hashed_password)


# ==================================================
# 사용자 인증
# ==================================================

def authenticate_user(username, password):
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        raise AuthenticationFailed("Invalid credentials")

    if not verify_password(password, user.password):
        raise AuthenticationFailed("Invalid credentials")

    return user


# ==================================================
# JWT 생성
# ==================================================

def create_access_token(user):
    payload = {
        "user_id": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
        "iat": datetime.utcnow(),
    }

    token = jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm="HS256",
    )

    return token


# ==================================================
# JWT 디코드
# ==================================================

def decode_access_token(token):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"],
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise AuthenticationFailed("Token expired")
    except jwt.InvalidTokenError:
        raise AuthenticationFailed("Invalid token")