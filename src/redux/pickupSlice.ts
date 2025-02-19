import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PickupRequest {
    type: string;
    address: object;
    details: object;
    estimatedCost: number;
}

interface PickupSliceState {
    step: number;
    pickupRequest: PickupRequest;
    isLoading: boolean;
    error: string | null;
}

const INITIAL_STATE: PickupSliceState = {
    step: localStorage.getItem('step') ? parseInt(localStorage.getItem('step') || '1') : 1,
    pickupRequest: {
        type: localStorage.getItem('type') || '',
        address: JSON.parse(localStorage.getItem('address') || '{}'),
        details: JSON.parse(localStorage.getItem('details') || '{}'),
        estimatedCost: 0,
    },
    isLoading: false,
    error: null,
};

const pickupSlice = createSlice({
    name: 'pickup',
    initialState: INITIAL_STATE,
    reducers: {
        setType: (state, action: PayloadAction<{ type: string }>) => {
            state.step = 1;
            state.pickupRequest.type = action.payload.type;
            localStorage.setItem('type', action.payload.type);
        },
        setAddress: (state, action: PayloadAction<{ address: object }>) => {
            state.step = 2;
            state.pickupRequest.address = action.payload.address;
            localStorage.setItem('address', JSON.stringify(action.payload.address));
        },
        setDetails: (state, action: PayloadAction<{ details: object }>) => {
            state.step = 3;
            state.pickupRequest.details = action.payload.details;
            localStorage.setItem('details', JSON.stringify(action.payload.details));
        },
        setCost: (state, action: PayloadAction<{ cost: number }>) => {
            state.pickupRequest.estimatedCost = action.payload.cost;
        },
        setStep: (state, action: PayloadAction<{ step: number }>) => {
            state.step = action.payload.step;
            localStorage.setItem('step', action.payload.step.toString());
        },
        setLoading: (state, action: PayloadAction<{ isLoading: boolean }>) => {
            state.isLoading = action.payload.isLoading;
        },
        setError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error;
        },
        resetPickup: (state) => {
            state.step = 1;
            state.pickupRequest = { type: '', address: {}, details: {}, estimatedCost: 0 };
            localStorage.removeItem('type');
            localStorage.removeItem('address');
            localStorage.removeItem('details');
        },
    },
});

export const { setType, setAddress, setDetails, setCost, setStep, setLoading, setError, resetPickup } = pickupSlice.actions;

export default pickupSlice.reducer;