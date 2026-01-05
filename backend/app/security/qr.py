import uuid
from fastapi import Header, HTTPException, status

def validate_qr_token(
    x_qr_token: str = Header(..., alias="X-QR-TOKEN")
):
    try:
        uuid.UUID(x_qr_token)  # ✅ UUID 형식 검증
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid QR token format",
        )

    return True
