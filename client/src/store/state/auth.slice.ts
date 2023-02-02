import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "types";

const initialState = {
    user: {} as IUser | undefined,
    auth: false,
};

const authSlice = createSlice({
    initialState,
    name: "auth",
    reducers: {
        setUser: (state, action: PayloadAction<{ user: IUser | undefined }>) => {
            state.user = action.payload?.user;
            state.auth = true;
        },
        removeUser: (state, action: PayloadAction<void>) => {
            state.user = undefined;
            state.auth = false;
        },
    },
});

export const { removeUser, setUser } = authSlice.actions;
export default authSlice.reducer;
