import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getWastePrices,
    createWastePrice,
    WastePrice,
} from "@/services/waste.api";

interface WastePriceState {
    items: WastePrice[];
    loading: boolean;
}

const initialState: WastePriceState = {
    items: [],
    loading: false,
};

export const fetchWastePrices = createAsyncThunk<
    WastePrice[],
    number
>("waste/fetch", async (contractId) => {
    return await getWastePrices(contractId);
});

export const addWastePrice = createAsyncThunk<
    WastePrice,
    {
        contractId: number;
        data: {
            waste_type: string;
            transport_fee: number;
            process_fee: number;
        };
    }
>("waste/add", async ({ contractId, data }) => {
    return await createWastePrice(contractId, data);
});

const wastePriceSlice = createSlice({
    name: "wastePrice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchWastePrices.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addWastePrice.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default wastePriceSlice.reducer;
