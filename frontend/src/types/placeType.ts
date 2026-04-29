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

    blockState?: BlockState | null

    size?: string | null
    count?: number | null

    start_date?: string | null
    end_date?: string | null   // 🔥 추가

    image_url?: string | null
}

/* =========================
   Slice State
========================= */
export interface PlaceState {
    items: Place[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}