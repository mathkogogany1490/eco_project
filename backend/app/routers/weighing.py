# app/routers/weighing.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.weighing import Weighing
from app.schemas.weighing import WeighingCreate, AutoWeighingCreate
from app.security.system import verify_system_key
from app.security.jwt import require_admin

router = APIRouter(prefix="/weighings", tags=["Weighings"])


@router.post("/auto", status_code=201)
def create_auto_weighing(
    data: AutoWeighingCreate,
    db: Session = Depends(get_db),
    _: bool = Depends(verify_system_key),
):
    net = data.gross_weight - data.tare_weight

    weighing = Weighing(
        contract_id=data.contract_id,
        vehicle_no=data.vehicle_no,
        gross_weight=data.gross_weight,
        tare_weight=data.tare_weight,
        net_weight=net,
        source="AUTO",
        status="PENDING",
    )

    db.add(weighing)
    db.commit()
    db.refresh(weighing)
    return weighing

@router.post("/")
def create_manual_weighing(
    data: WeighingCreate,
    db: Session = Depends(get_db),
    user=Depends(require_admin),
):
    net = data.gross_weight - data.tare_weight

    weighing = Weighing(
        **data.dict(),
        net_weight=net,
        source="MANUAL",
        status="CONFIRMED",
        confirmed_at=datetime.utcnow(),
    )

    db.add(weighing)
    db.commit()
    db.refresh(weighing)
    return weighing


