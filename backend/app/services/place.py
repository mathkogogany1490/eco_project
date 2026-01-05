import os
import shutil
from uuid import uuid4
from sqlalchemy.orm import Session
from fastapi import UploadFile

from app.models.place import Place
from app.schemas.place import PlaceCreate, PlaceUpdate

UPLOAD_DIR = "uploads/places"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================
# 조회
# =========================
def get_all_places(db: Session):
    return db.query(Place).all()


def get_place_by_id(db: Session, place_id: int):
    return db.query(Place).filter(Place.id == place_id).first()


# =========================
# 생성 (JSON)
# =========================
def create_place(db: Session, place: PlaceCreate):
    db_place = Place(**place.model_dump(exclude_unset=True))
    db.add(db_place)
    db.commit()
    db.refresh(db_place)
    return db_place


# =========================
# 수정 (부분 업데이트 - PATCH)
# =========================
def update_place(db: Session, id: int, place: PlaceUpdate):
    db_place = get_place_by_id(db, id)
    if not db_place:
        return None

    update_data = place.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_place, key, value)

    db.commit()
    db.refresh(db_place)
    return db_place


# =========================
# 삭제
# =========================
def delete_place(db: Session, place_id: int):
    place = get_place_by_id(db, place_id)
    if not place:
        return False

    # 🔥 파일도 같이 삭제 (선택)
    if place.image_url:
        file_path = place.image_url.replace("/uploads/", "uploads/")
        if os.path.exists(file_path):
            os.remove(file_path)

    db.delete(place)
    db.commit()
    return True


# =========================
# 📸 사진 업로드 → 장소 생성
# =========================
def save_photo_as_new_place(
    db: Session,
    photo: UploadFile,
    latitude: float,
    longitude: float,
):
    filename = f"{uuid4()}_{photo.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        # 파일 저장
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)

        new_place = Place(
            company_name="사진 등록 장소",
            latitude=latitude,
            longitude=longitude,
            image_url=f"/uploads/places/{filename}",  # ✅ URL 형태
        )

        db.add(new_place)
        db.commit()
        db.refresh(new_place)
        return new_place

    except Exception as e:
        db.rollback()
        if os.path.exists(file_path):
            os.remove(file_path)
        raise e
