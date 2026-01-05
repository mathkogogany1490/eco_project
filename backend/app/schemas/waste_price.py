from pydantic import BaseModel, Field, ConfigDict


# =========================
# 요청용 (Create / Update)
# =========================
class WastePriceCreate(BaseModel):
    waste_type: str

    transport_fee: int = Field(
        ge=0,
        description="운반비 (0 이상)",
    )

    process_fee: int = Field(
        ge=0,
        description="처리비 (0 이상)",
    )


# =========================
# 응답용
# =========================
class WastePriceOut(WastePriceCreate):
    id: int

    model_config = ConfigDict(
        from_attributes=True,   # 🔥 ORM 대응
    )
