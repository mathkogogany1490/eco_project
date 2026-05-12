import api from './api'

import {
    VehicleDispatch
} from '@/types/vehicleDispatchType'

/* =========================
   전체 조회
========================= */
export const getVehicleDispatches =
    async (): Promise<VehicleDispatch[]> => {

        const res = await api.get(
            '/vehicle-dispatch/'
        )

        return res.data
    }

/* =========================
   등록
========================= */
export const createVehicleDispatch =
    async (
        payload: Partial<VehicleDispatch>
    ): Promise<VehicleDispatch> => {

        const res = await api.post(
            '/vehicle-dispatch/',
            payload
        )

        return res.data
    }

/* =========================
   수정
========================= */
export const updateVehicleDispatch =
    async (
        payload: Partial<VehicleDispatch>
    ): Promise<VehicleDispatch> => {

        const res = await api.patch(
            `/vehicle-dispatch/${payload.id}/`,
            payload
        )

        return res.data
    }

/* =========================
   삭제
========================= */
export const deleteVehicleDispatch =
    async (
        id: number
    ): Promise<void> => {

        await api.delete(
            `/vehicle-dispatch/${id}/`
        )
    }