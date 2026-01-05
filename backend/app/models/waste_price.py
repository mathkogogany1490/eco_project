from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship

contract = relationship("Contract")

class WastePrice(Base):
    __tablename__ = "waste_prices"

    id = Column(Integer, primary_key=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    waste_type = Column(String)
    transport_fee = Column(Integer)
    process_fee = Column(Integer)

