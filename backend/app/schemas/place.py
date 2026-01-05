from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal


# =========================
# 요청용 (Create)
# =========================
class PlaceCreate(BaseModel):
    company_name: str

    # 위치 정보 (DB와 동일)
    latitude: float
    longitude: float

    phone_number: Optional[str] = None
    block_state: Optional[str] = None
    image_url: Optional[str] = None
    start_date: Optional[str] = None
    address: Optional[str] = None
    size: Optional[str] = None
    count: Optional[int] = None


# =========================
# 요청용 (Update / PATCH)
# =========================


BlockState = Literal["반입", "반출", "고정"]

class PlaceUpdate(BaseModel):
    company_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None

    block_state: Optional[BlockState] = None  # 🔥 핵심

    size: Optional[str] = None
    count: Optional[int] = None
    start_date: Optional[str] = None


# =========================
# 응답용 (Frontend)
# =========================
class PlaceOut(BaseModel):
    id: int
    company_name: str

    # 🔥 프론트는 camelCase
    latitude: float
    longitude: float

    phone_number: Optional[str] = None

    blockState: Optional[str] = Field(
        default=None,
        alias="block_state",
    )

    image_url: Optional[str] = None
    start_date: Optional[str] = None
    address: Optional[str] = None
    size: Optional[str] = None
    count: Optional[int] = None

    model_config = ConfigDict(
        from_attributes=True,   # SQLAlchemy ORM → Pydantic
        populate_by_name=True,  # alias 허용
    )
