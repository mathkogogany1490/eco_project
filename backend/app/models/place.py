# app/models/place.py

from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Place(Base):
    __tablename__ = "places"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    # 회사 / 장소 정보
    company_name = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    address = Column(String, nullable=True)

    # 위치 정보 (의미 명확화)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    # 상태 (프론트 blockState ↔ DB block_state)
    block_state = Column(String, nullable=True)

    # 기타 정보
    image_url = Column(String, nullable=True)
    start_date = Column(String, nullable=True)   # YYYY-MM-DD
    size = Column(String, nullable=True)         # 루베
    count = Column(Integer, nullable=True)       # 개수

    def __repr__(self) -> str:
        return (
            f"<Place id={self.id}, "
            f"company_name={self.company_name}, "
            f"latitude={self.latitude}, longitude={self.longitude}, "
            f"block_state={self.block_state}>"
        )
