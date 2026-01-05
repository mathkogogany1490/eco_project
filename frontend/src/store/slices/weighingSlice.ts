import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createAutoWeighing,
    createManualWeighing,
} from "@/services/weighing.api";

export const addAutoWeighing = createAsyncThunk(
    "weighing/auto",
    async ({
               data,
               systemApiKey,
           }: {
        data: any;
        systemApiKey: string;
    }) => {
        return await createAutoWeighing(data, systemApiKey);
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
        builder.addCase(addAutoWeighing.fulfilled, () => {});
        builder.addCase(addManualWeighing.fulfilled, () => {});
    },
});

export default weighingSlice.reducer;
