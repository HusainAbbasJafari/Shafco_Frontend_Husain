import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: null,
        user: null,
        userId: null,
        authType: "",
        openAuthModal: false
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token;
            state.userId = action.payload.userId;
        },
        setUserDetails: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
        },
        setAuthType: (state) => {
            state.authType = action.payload
        },
        setOpenAuthModal: (state) => {
            state.openAuthModal = action.payload
        }
    },
});

export const { login, logout, setAuthType, setOpenAuthModal, setUserDetails } = authSlice.actions;
export default authSlice.reducer;
