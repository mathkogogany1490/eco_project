import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createAutoWeighing,
    createManualWeighing,
} from "@/services/weighing.api";

export interface AutoWeighingPayload {
    contract_id: number;
    vehicle_no: string;
    gross_weight: number;
    tare_weight: number;
    sensor_id: string; // 🔥 추가
}

export const addAutoWeighing = createAsyncThunk(
    "weighing/auto",
    async (data: AutoWeighingPayload) => {
        return await createAutoWeighing(data);
    }
);

export const addManualWeighing = createAsyncThunk(
    "weighing/manual",
    async (data: any) => {
        return await createManualWeighing(data);
    }
);

const weighingSlice = createSlice({
    name: "weighing",
    initialState: { loading: false },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addAutoWeighing.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAutoWeighing.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addAutoWeighing.rejected, (state) => {
                state.loading = false;
            })

            .addCase(addManualWeighing.pending, (state) => {
                state.loading = true;
            })
            .addCase(addManualWeighing.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addManualWeighing.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default weighingSlice.reducer;
