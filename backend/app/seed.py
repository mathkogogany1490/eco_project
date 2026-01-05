# seed_direct.py
import os
from datetime import datetime

from sqlalchemy import (
    create_engine, Column, Integer, String, Float, ForeignKey, DateTime
)
from sqlalchemy.orm import sessionmaker, declarative_base
from passlib.context import CryptContext

# =========================
# AWS PostgreSQL 직접 연결
# =========================
DATABASE_URL = "postgresql://kogo:math1106@43.200.171.10:5432/mydb"

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

pwd = CryptContext(schemes=["argon2"], deprecated="auto")


def safe_hash(password: str) -> str:
    return pwd.hash(password)


# =========================
# 테이블 정의 (직접)
# =========================
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String)
    role = Column(String, nullable=False)


class Contract(Base):
    __tablename__ = "contracts"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    type = Column(String)
    company = Column(String)


class WastePrice(Base):
    __tablename__ = "waste_prices"
    id = Column(Integer, primary_key=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    waste_type = Column(String)
    transport_fee = Column(Integer)
    process_fee = Column(Integer)


class Weighing(Base):
    __tablename__ = "weighings"
    id = Column(Integer, primary_key=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"))
    vehicle_no = Column(String)
    gross_weight = Column(Integer)
    tare_weight = Column(Integer)
    net_weight = Column(Integer)
    source = Column(String)
    status = Column(String)
    created_at = Column(DateTime)


class Place(Base):
    __tablename__ = "places"
    id = Column(Integer, primary_key=True)
    company_name = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    phone_number = Column(String)
    block_state = Column(String)
    image_url = Column(String)
    start_date = Column(String)
    address = Column(String)
    size = Column(String)
    count = Column(Integer)


# =========================
# Seed 실행
# =========================
def run_seed():
    print("🚀 AWS PostgreSQL 접속:", DATABASE_URL)

    # 테이블 생성 (이미 있으면 무시)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Users
        if not db.query(User).filter_by(username="admin").first():
            db.add(User(
                username="admin",
                password=safe_hash("admin123"),
                role="ADMIN",
            ))

        if not db.query(User).filter_by(username="system").first():
            db.add(User(
                username="system",
                password=None,
                role="SYSTEM",
            ))
        db.commit()

        # Contracts
        if not db.query(Contract).first():
            c = Contract(name="서울시 도로공사", type="관급", company="서울시청")
            db.add(c)
            db.commit()
            db.refresh(c)

            db.add_all([
                WastePrice(
                    contract_id=c.id,
                    waste_type="콘크리트",
                    transport_fee=12000,
                    process_fee=8000,
                ),
                WastePrice(
                    contract_id=c.id,
                    waste_type="혼합폐기물",
                    transport_fee=15000,
                    process_fee=10000,
                ),
            ])

            db.add(
                Weighing(
                    contract_id=c.id,
                    vehicle_no="서울12가3456",
                    gross_weight=25000,
                    tare_weight=10000,
                    net_weight=15000,
                    source="AUTO",
                    status="PENDING",
                    created_at=datetime.utcnow(),
                )
            )
            db.commit()

        # Places
        if not db.query(Place).first():
            db.add_all([
                Place(
                    company_name="서울시청 건설부",
                    lat=37.5665,
                    lng=126.9780,
                    phone_number="02-120",
                    block_state="ACTIVE",
                    start_date="2024-01-01",
                    address="서울특별시 중구 세종대로 110",
                    size="대형",
                    count=3,
                ),
                Place(
                    company_name="강남 재건축 현장",
                    lat=37.4979,
                    lng=127.0276,
                    phone_number="02-555-1234",
                    block_state="ACTIVE",
                    start_date="2024-03-15",
                    address="서울특별시 강남구 테헤란로",
                    size="중형",
                    count=2,
                ),
            ])
            db.commit()

        print("✅ 더미 데이터 삽입 완료")

    finally:
        db.close()


if __name__ == "__main__":
    run_seed()
