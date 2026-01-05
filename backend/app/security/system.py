from fastapi import Header, HTTPException, status
import os

SYSTEM_API_KEY = os.getenv("SYSTEM_API_KEY")
if not SYSTEM_API_KEY:
    raise RuntimeError("SYSTEM_API_KEY is not set")

def verify_system_key(x_api_key: str = Header(..., alias="X-API-KEY")):
    if x_api_key != SYSTEM_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid system key"
        )
    return True

