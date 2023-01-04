import { createSlice } from '@reduxjs/toolkit';
export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        status: 'checking',//'authenticated', 'not-authenticated'
        user: {},
        tipoUsuario: {},
        errorMessage: undefined,
    },
    reducers: {
        onCheking: (state) => {
            state.status = 'checking';
            state.user = {};
            state.errorMessage = undefined;
        },
        onFirstLogin: (state, { payload }) => {
            const {user, tipoUsuario} = payload;
            state.status = 'firstLogin';
            state.user = user;
            state.tipoUsuario = tipoUsuario;
            state.errorMessage = undefined;
        },
        onLogin: (state, { payload }) => {
            const {user, tipoUsuario} = payload;
            state.status = 'authenticated';
            state.user = user;
            state.tipoUsuario = tipoUsuario;
            state.errorMessage = undefined;
        },
        onLogout: (state, { payload }) => {
            // state.status = 'not-authenticated';
            state.status = 'not-authenticated';
            state.user = {};
            state.errorMessage = payload;
        },
        clearErrorMessage: (state) => {
            state.errorMessage = undefined;
        }
    },
})
export const { onCheking, onLogin, onLogout, clearErrorMessage, onFirstLogin } = authSlice.actions