import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    getPlaces,
    updatePlace as updatePlaceAPI,
    deletePlace as deletePlaceAPI,
    uploadPlacePhoto,
} from '@/services/place.api'

/* =========================
   Place 타입 (Frontend 기준)
========================= */
export type BlockState = '반입' | '반출' | '고정'

export interface Place {
    id: number
    company_name: string

    latitude: number
    longitude: number

    phone_number?: string | null
    address?: string | null

    blockState?: BlockState | null   // 🔥 고정

    size?: string | null
    count?: number | null

    start_date?: string | null
    image_url?: string | null
}


/* =========================
   Slice State
========================= */
interface PlaceState {
    items: Place[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}

const initialState: PlaceState = {
    items: [],
    status: 'idle',
    error: null,
}

/* =========================
   Thunks
========================= */

// 전체 조회
export const fetchPlaces = createAsyncThunk<
    Place[],
    void,
    { rejectValue: string }
>('places/fetchPlaces', async (_, { rejectWithValue }) => {
    try {
        return await getPlaces()
    } catch (err: unknown) {
        if (err instanceof Error) {
            return rejectWithValue(err.message)
        }
        return rejectWithValue('장소 조회 실패')
    }
})

// 수정 (PATCH)
export const updatePlace = createAsyncThunk<
    Place,
    Partial<Place>,
    { rejectValue: string }
>('places/updatePlace', async (place, { rejectWithValue }) => {
    try {
        return await updatePlaceAPI(place)
    } catch (err: unknown) {
        if (err instanceof Error) {
            return rejectWithValue(err.message)
        }
        return rejectWithValue('장소 수정 실패')
    }
})

// 삭제
export const deletePlace = createAsyncThunk<
    number,
    number,
    { rejectValue: string }
>('places/deletePlace', async (placeId, { rejectWithValue }) => {
    try {
        await deletePlaceAPI(placeId)
        return placeId
    } catch (err: unknown) {
        if (err instanceof Error) {
            return rejectWithValue(err.message)
        }
        return rejectWithValue('장소 삭제 실패')
    }
})

// 📸 사진 업로드 → 장소 생성
export const createPlaceWithPhoto = createAsyncThunk<
    Place,
    {
        file: File
        latitude: number
        longitude: number
        token: string
    },
    { rejectValue: string }
>('places/createPlaceWithPhoto', async (payload, { rejectWithValue }) => {
    try {
        const { file, latitude, longitude, token } = payload
        return await uploadPlacePhoto(file, latitude, longitude, token)
    } catch (err: unknown) {
        if (err instanceof Error) {
            return rejectWithValue(err.message)
        }
        return rejectWithValue('장소 등록 실패')
    }
})

/* =========================
   Slice
========================= */
const placeSlice = createSlice({
    name: 'places',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            /* ================= fetch ================= */
            .addCase(fetchPlaces.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(
                fetchPlaces.fulfilled,
                (state, action: PayloadAction<Place[]>) => {
                    state.items = action.payload
                    state.status = 'succeeded'
                }
            )
            .addCase(fetchPlaces.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? '장소 조회 실패'
            })

            /* ================= update ================= */
            .addCase(updatePlace.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(
                updatePlace.fulfilled,
                (state, action: PayloadAction<Place>) => {
                    const index = state.items.findIndex(
                        (p) => p.id === action.payload.id
                    )
                    if (index !== -1) {
                        state.items[index] = action.payload
                    }
                    state.status = 'succeeded'
                }
            )
            .addCase(updatePlace.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? '장소 수정 실패'
            })

            /* ================= delete ================= */
            .addCase(
                deletePlace.fulfilled,
                (state, action: PayloadAction<number>) => {
                    state.items = state.items.filter(
                        (p) => p.id !== action.payload
                    )
                }
            )

            /* ================= create (photo) ================= */
            .addCase(createPlaceWithPhoto.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(
                createPlaceWithPhoto.fulfilled,
                (state, action: PayloadAction<Place>) => {
                    state.items.push(action.payload)
                    state.status = 'succeeded'
                }
            )
            .addCase(createPlaceWithPhoto.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload ?? '장소 등록 실패'
            })
    },
})

export default placeSlice.reducer
