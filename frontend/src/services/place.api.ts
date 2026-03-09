import api from './api'
import type { Place } from '@/types/placeType'

/* =========================
   전체 조회
========================= */
export const getPlaces = async (): Promise<Place[]> => {
    const res = await api.get<Place[]>('/places/')
    return res.data
}

/* =========================
   수정 (PATCH)
========================= */
export const updatePlace = async (
    place: Partial<Place>
): Promise<Place> => {
    if (!place.id) {
        throw new Error('place.id is required')
    }

    const { id, ...payload } = place

    const res = await api.patch<Place>(
        `/places/${id}/`,
        payload
    )

    return res.data
}

/* =========================
   삭제
========================= */
export const deletePlace = async (
    placeId: number
): Promise<void> => {
    await api.delete(`/places/${placeId}/`)
}

/* =========================
   📸 사진 업로드 → 장소 생성
========================= */
export const uploadPlacePhoto = async (
    file: File,
    latitude: number,
    longitude: number,
    qrToken: string
): Promise<Place> => {

    if (!qrToken?.trim()) {
        throw new Error('QR 토큰이 유효하지 않습니다')
    }

    const formData = new FormData()
    formData.append('photo', file)
    formData.append('latitude', String(latitude))
    formData.append('longitude', String(longitude))

    const res = await api.post<Place>(
        '/places/upload_photo/',   // 🔥 Django action 이름 확인 필요
        formData,
        {
            headers: {
                'X-QR-TOKEN': qrToken.trim(),
            },
        }
    )

    return res.data
}