from fastapi import Depends, HTTPException, status

from app.models.user import User
from app.core.security import get_current_user


# =========================
# ADMIN only
# =========================
def require_admin(
    current_user: User = Depends(get_current_user),
) -> User:
    if current_user.role != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin only",
        )

    return current_user
