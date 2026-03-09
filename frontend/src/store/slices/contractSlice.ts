import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getContracts } from "@/services/contract.api";
import {Contract, ContractState} from "@/types/contractType";


const initialState: ContractState = {
    items: [],
    loading: false,
};

export const fetchContracts = createAsyncThunk<Contract[]>(
    "contract/fetch",
    async () => {
        return await getContracts();
    }
);

const contractSlice = createSlice({
    name: "contract",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchContracts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchContracts.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            });
    },
});

export default contractSlice.reducer;
