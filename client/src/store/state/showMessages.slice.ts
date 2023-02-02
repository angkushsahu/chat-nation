import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChat } from "types";

const initialState: { chat: IChat | null } = {
    chat: null,
};

const showMessageSlice = createSlice({
    initialState,
    name: "showMessage",
    reducers: {
        showMessage: (state, action: PayloadAction<{ chat: IChat }>) => {
            state.chat = action.payload.chat;
        },
        hideMessage: (state, action: PayloadAction<void>) => {
            state.chat = null;
        },
    },
});

export const { hideMessage, showMessage } = showMessageSlice.actions;
export default showMessageSlice.reducer;
