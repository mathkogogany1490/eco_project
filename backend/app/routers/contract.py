from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.contract import Contract
from app.schemas.contract import ContractOut

router = APIRouter(prefix="/contracts", tags=["Contracts"])

@router.get("", response_model=list[ContractOut])
def list_contracts(db: Session = Depends(get_db)):
    return db.query(Contract).all()
