import {
    createSlice,
    createAsyncThunk,
    PayloadAction,
} from '@reduxjs/toolkit'

import {

    getVehicleDispatches,
    createVehicleDispatch,
    updateVehicleDispatch,
    deleteVehicleDispatch,

} from '@/services/vehicleDispatch.api'

import {
    VehicleDispatch,
    VehicleDispatchState,
} from '@/types/vehicleDispatchType'

const initialState: VehicleDispatchState = {

    items: [],

    status: 'idle',

    error: null,
}

/* =========================
   FETCH
========================= */

export const fetchVehicleDispatches =
    createAsyncThunk(

        'vehicleDispatch/fetch',

        async () => {

            return await getVehicleDispatches()
        }
    )

/* =========================
   CREATE
========================= */

export const createDispatch =
    createAsyncThunk(

        'vehicleDispatch/create',

        async (
            payload: Partial<VehicleDispatch>
        ) => {

            return await createVehicleDispatch(
                payload
            )
        }
    )

/* =========================
   UPDATE
========================= */

export const updateDispatch =
    createAsyncThunk(

        'vehicleDispatch/update',

        async (
            payload: Partial<VehicleDispatch>
        ) => {

            return await updateVehicleDispatch(
                payload
            )
        }
    )

/* =========================
   DELETE
========================= */

export const deleteDispatch =
    createAsyncThunk(

        'vehicleDispatch/delete',

        async (id: number) => {

            await deleteVehicleDispatch(id)

            return id
        }
    )

const vehicleDispatchSlice =
    createSlice({

        name: 'vehicleDispatch',

        initialState,

        reducers: {},

        extraReducers: (builder) => {

            builder

                .addCase(
                    fetchVehicleDispatches.fulfilled,
                    (
                        state,
                        action: PayloadAction<
                            VehicleDispatch[]
                        >
                    ) => {

                        state.items =
                            action.payload
                    }
                )

                .addCase(
                    createDispatch.fulfilled,
                    (
                        state,
                        action: PayloadAction<
                            VehicleDispatch
                        >
                    ) => {

                        state.items.push(
                            action.payload
                        )
                    }
                )

                .addCase(
                    updateDispatch.fulfilled,
                    (
                        state,
                        action: PayloadAction<
                            VehicleDispatch
                        >
                    ) => {

                        const index =
                            state.items.findIndex(
                                (item) =>
                                    item.id ===
                                    action.payload.id
                            )

                        if (index !== -1) {

                            state.items[index] =
                                action.payload
                        }
                    }
                )

                .addCase(
                    deleteDispatch.fulfilled,
                    (
                        state,
                        action: PayloadAction<number>
                    ) => {

                        state.items =
                            state.items.filter(
                                (item) =>
                                    item.id !==
                                    action.payload
                            )
                    }
                )
        },
    })

export default vehicleDispatchSlice.reducer