from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    company = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)  # ✅ 있음


