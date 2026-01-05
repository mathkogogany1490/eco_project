from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    UploadFile,
    File,
    Form,
    status,
)
from typing import List
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.place import (
    PlaceCreate,
    PlaceUpdate,
    PlaceOut,
)
from app.services.place import (
    get_all_places,
    get_place_by_id,
    create_place,
    update_place,
    delete_place,
    save_photo_as_new_place,
)

# 🔐 JWT 인증
from app.core.security import get_current_user
from app.models.user import User


router = APIRouter(
    prefix="/places",
    tags=["Places"],
)

# =========================
# 전체 조회
# =========================
@router.get(
    "",
    response_model=List[PlaceOut],
)
def read_places(
    db: Session = Depends(get_db),
):
    return get_all_places(db)


# =========================
# 단건 조회
# =========================
@router.get(
    "/{id}",
    response_model=PlaceOut,
)
def read_place(
    id: int,
    db: Session = Depends(get_db),
):
    place = get_place_by_id(db, id)
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found",
        )
    return place


# =========================
# 생성 (JSON)
# =========================
@router.post(
    "",
    response_model=PlaceOut,
    status_code=status.HTTP_201_CREATED,
)
def create_new_place(
    place: PlaceCreate,
    db: Session = Depends(get_db),
):
    return create_place(db, place)


# =========================
# 수정 (부분 수정, JSON)
# =========================
@router.patch(
    "/{id}",
    response_model=PlaceOut,
)
def update_existing_place(
    id: int,
    place: PlaceUpdate,
    db: Session = Depends(get_db),
):
    updated_place = update_place(db, id, place)
    if not updated_place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found",
        )
    return updated_place


# =========================
# 삭제
# =========================
@router.delete(
    "/{id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_place(
    id: int,
    db: Session = Depends(get_db),
):
    deleted = delete_place(db, id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found",
        )
    return None


# =========================
# 📸 사진 업로드 + 장소 생성
# =========================
@router.post(
    "/upload-photo",
    response_model=PlaceOut,
    status_code=status.HTTP_201_CREATED,
)
def upload_photo(
    photo: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    place = save_photo_as_new_place(
        db=db,
        photo=photo,
        latitude=latitude,
        longitude=longitude,
        user=current_user,  # 🔥 소유자 연결
    )
    return place
