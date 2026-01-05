from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Body,
)
from sqlalchemy.orm import Session
import uuid

from app.database import get_db
from app.models.user import User
from app.schemas.user import LoginRequest
from app.core.security import (
    verify_password,
    create_access_token,
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"],
)

# ======================================================
# ✅ 일반 로그인
# ======================================================
@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.username == data.username)
        .first()
    )

    if not user or not verify_password(
        data.password,
        user.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }


# ======================================================
# 🔥 QR 생성 (관리자 → 모바일용)
# ======================================================
@router.post("/qr-generate")
def generate_qr(
    db: Session = Depends(get_db),
):
    """
    관리자 페이지에서 QR 생성
    """
    qr_token = str(uuid.uuid4())

    # 예시: MOBILE 사용자에게 토큰 발급
    user = (
        db.query(User)
        .filter(User.role == "MOBILE")
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mobile user not found",
        )

    user.qr_token = qr_token
    db.commit()

    return {
        "token": qr_token
    }


# ======================================================
# 🔥 QR 자동 로그인
# ======================================================
@router.post("/qr-login")
def qr_login(
    qr_token: str = Body(..., embed=True),
    db: Session = Depends(get_db),
):
    try:
        uuid.UUID(qr_token)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid QR token",
        )

    user = (
        db.query(User)
        .filter(User.qr_token == qr_token)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="QR token expired or invalid",
        )

    # 🔥 1회용 처리
    user.qr_token = None
    db.commit()

    access_token = create_access_token(
        data={
            "sub": str(user.id),
            "username": user.username,
            "role": user.role,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
    }
