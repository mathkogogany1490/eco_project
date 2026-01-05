from pydantic import BaseModel, ConfigDict


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

    model_config = ConfigDict(
        extra="forbid"   # 🔐 예상치 못한 필드 차단
    )
