# app/schemas/weighing.py
from pydantic import BaseModel, Field, model_validator


# =========================
# 공통 계량 생성
# =========================
class WeighingCreate(BaseModel):
    contract_id: int

    vehicle_no: str = Field(
        min_length=2,
        max_length=20,
        description="차량 번호",
    )

    gross_weight: int = Field(
        ge=0,
        description="총중량 (kg)",
    )

    tare_weight: int = Field(
        ge=0,
        description="공차중량 (kg)",
    )

    # 🔥 핵심 검증
    @model_validator(mode="after")
    def validate_weight(self):
        if self.gross_weight < self.tare_weight:
            raise ValueError(
                "gross_weight must be greater than or equal to tare_weight"
            )
        return self


# =========================
# 자동 계량
# =========================
class AutoWeighingCreate(WeighingCreate):
    sensor_id: str = Field(
        description="계근기 / 센서 ID",
    )
