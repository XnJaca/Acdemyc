import { createSlice } from '@reduxjs/toolkit';
export const apiSlice = createSlice({
    name: 'api',
    initialState: {
        status: false, 
        data: [],
        isError: false,
        errorMessage: undefined,
    },
    reducers: {
        onLoad: (state) => {
            state.status = true;
        },
        onCloseLoad: (state) => {
            state.status = false;
        },
        onGetData: (state, { payload = [] }) => { 
            state.status = false;
            state.data = payload;
            state.errorMessage = undefined;
        },
        onAddNewData: (state, { payload = {} }) => {
            state.status = false;
            state.data.push(payload);
            state.errorMessage = undefined;
        },
        onUpdateData: (state, { payload = [] }) => {
            state.status = false;
            state.data = payload;
            state.errorMessage = undefined;
        },
        onError: (state, { payload = {} }) => {
            state.status = false;
            state.isError = true;
            state.errorMessage = payload.message;
        },
    },
})
export const { 
    onLoad, 
    onGetData,
    onUpdateData,
    onError,
    onAddNewData,
    onCloseLoad,
} = apiSlice.actions