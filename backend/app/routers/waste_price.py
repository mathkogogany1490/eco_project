from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.waste_price import WastePrice
from app.schemas.waste_price import WastePriceCreate, WastePriceOut

router = APIRouter(
    prefix="/contracts/{contract_id}/wastes",
    tags=["WastePrice"]
)

@router.get("/", response_model=list[WastePriceOut])
def list_wastes(contract_id: int, db: Session = Depends(get_db)):
    return db.query(WastePrice).filter_by(contract_id=contract_id).all()

@router.post("/", response_model=WastePriceOut)
def create_waste(
    contract_id: int,
    data: WastePriceCreate,
    db: Session = Depends(get_db),
):
    waste = WastePrice(contract_id=contract_id, **data.dict())
    db.add(waste)
    db.commit()
    db.refresh(waste)
    return waste
