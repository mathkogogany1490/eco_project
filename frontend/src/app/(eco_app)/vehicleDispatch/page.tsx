'use client'

import {
    useEffect,
    useState,
} from 'react'

import { Button } from 'antd'

import {

    useAppDispatch,
    useAppSelector,

} from '@/store/hooks'

import {

    fetchVehicleDispatches,
    createDispatch,

} from '@/store/slices/vehicleDispatchSlice';

import VehicleDispatchTable
    from '@/components/vehicleDispatch/VehicleDispatchTable'

import VehicleDispatchModal
    from '@/components/vehicleDispatch/VehicleDispatchModal'

export default function VehicleDispatchPage() {

    const dispatch = useAppDispatch()

    const { items } =
        useAppSelector(
            (state) => state.vehicleDispatch
        )

    const [open, setOpen] =
        useState(false)

    useEffect(() => {

        dispatch(
            fetchVehicleDispatches()
        )

    }, [])

    return (

        <div className="p-6">

            <div className="mb-4 flex justify-between">

                <h1 className="text-2xl font-bold">
                    차량 배차 관리
                </h1>

                <Button
                    type="primary"
                    onClick={() => setOpen(true)}
                >
                    배차 등록
                </Button>

            </div>

            <VehicleDispatchTable
                data={items}
            />

            <VehicleDispatchModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={(values) => {

                    dispatch(
                        createDispatch(values)
                    )

                    setOpen(false)
                }}
            />

        </div>
    )
}