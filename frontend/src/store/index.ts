import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import contractReducer from "./slices/contractSlice";
import placeReducer from "./slices/placeSlice";
import wastePriceReducer from "./slices/wastePriceSlice";
import weighingReducer from "./slices/weighingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        contract: contractReducer,
        place: placeReducer,
        wastePrice: wastePriceReducer,
        weighing: weighingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
