from dotenv import load_dotenv
load_dotenv()

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.place import Place
from app.models.contract import Contract
from app.models.user import User
from app.models.weighing import Weighing
from app.models.waste_price import WastePrice

from app.routers import auth
from app.routers import contract as contract_router
from app.routers import weighing as weighing_router
from app.routers import place as place_router
from app.routers import waste_price as waste_price_router



# =========================
# DB 초기화 (개발용)
# ⚠️ 운영에서는 Alembic 사용 권장
# =========================
if os.getenv("APP_ENV", "development") == "development":
    Base.metadata.create_all(bind=engine)


# =========================
# FastAPI App
# =========================
app = FastAPI(
    title=os.getenv("APP_NAME", "Eco-Scale API"),
    version="1.0.0",
)


# =========================
# CORS 설정 (환경변수 기반)
# =========================
cors_origins = os.getenv("CORS_ORIGINS", "")
origins = [origin.strip() for origin in cors_origins.split(",") if origin]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins if origins else ["*"],  # fallback
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# =========================
# Routers
# =========================
app.include_router(auth.router, prefix="/api")
app.include_router(contract_router.router, prefix="/api")
app.include_router(weighing_router.router, prefix="/api")
app.include_router(place_router.router, prefix="/api")
app.include_router(waste_price_router.router, prefix="/api")


# =========================
# Health Check (추천)
# =========================
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "app": app.title,
        "env": os.getenv("APP_ENV"),
    }
