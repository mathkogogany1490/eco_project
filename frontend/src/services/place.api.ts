import api from './api'
import type { Place } from '@/store/slices/placeSlice'

/* =========================
   전체 조회
========================= */
export const getPlaces = async (): Promise<Place[]> => {
    const res = await api.get<Place[]>('/places')
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
        `/places/${id}`,   // ✅ PATCH
        payload            // ✅ id 제거
    )
    return res.data
}

/* =========================
   삭제
========================= */
export const deletePlace = async (
    placeId: number
): Promise<void> => {
    await api.delete(`/places/${placeId}`)
}

/* =========================
   📸 사진 업로드 → 장소 생성
========================= */
export const uploadPlacePhoto = async (
    file: File,
    latitude: number,
    longitude: number,
    token: string
): Promise<Place> => {
    const normalizedToken = decodeURIComponent(token).trim()

    if (!normalizedToken) {
        throw new Error('QR 토큰이 유효하지 않습니다')
    }

    const formData = new FormData()
    formData.append('photo', file)
    formData.append('latitude', String(latitude))
    formData.append('longitude', String(longitude))

    const res = await api.post<Place>(
        '/places/upload-photo',   // ✅ kebab-case
        formData,
        {
            headers: {
                'X-QR-TOKEN': normalizedToken,
            },
        }
    )

    return res.data
}
