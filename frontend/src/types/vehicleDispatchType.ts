export interface VehicleDispatch {

    id: number
    vehicle_number: string
    driver_name: string
    phone_number?: string
    dispatch_date?: string
    destination?: string
    memo?: string
}

export interface VehicleDispatchState {

    items: VehicleDispatch[]
    status: 'idle' | 'loading' | 'succeeded' | 'failed'
    error: string | null
}