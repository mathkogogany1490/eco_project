from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.database import Base

class Weighing(Base):
    __tablename__ = "weighings"

    id = Column(Integer, primary_key=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    vehicle_no = Column(String)

    gross_weight = Column(Integer)
    tare_weight = Column(Integer)
    net_weight = Column(Integer)

    source = Column(String, default="AUTO")     # AUTO | MANUAL
    status = Column(String, default="PENDING", index=True) # PENDING | CONFIRMED

    created_at = Column(DateTime, default=datetime.utcnow)
    confirmed_at = Column(DateTime, nullable=True)

