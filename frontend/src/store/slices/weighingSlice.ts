import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createManualWeighing,
    createAutoWeighing,
} from "@/services/weighing.api";

import {ManualWeighingPayload, AutoWeighingPayload} from "@/types/weighingType";


/* =============================
   수동 계근
============================= */
export const addManualWeighing = createAsyncThunk(
    "weighing/manual",
    async (data: ManualWeighingPayload) => {
        return await createManualWeighing(data);
    }
);

/* =============================
   자동 계근
============================= */
export const addAutoWeighing = createAsyncThunk(
    "weighing/auto",
    async (data: AutoWeighingPayload) => {
        return await createAutoWeighing(data);
    }
);

interface WeighingState {
    loading: boolean;
}

const initialState: WeighingState = {
    loading: false,
};

const weighingSlice = createSlice({
    name: "weighing",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            /* 수동 계근 */
            .addCase(addManualWeighing.pending, (state) => {
                state.loading = true;
            })
            .addCase(addManualWeighing.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addManualWeighing.rejected, (state) => {
                state.loading = false;
            })

            /* 자동 계근 */
            .addCase(addAutoWeighing.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAutoWeighing.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(addAutoWeighing.rejected, (state) => {
                state.loading = false;
            });
    },
});

export default weighingSlice.reducer;