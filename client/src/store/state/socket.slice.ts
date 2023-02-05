import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { apiUrl } from "store/apiUrl";

interface ISocket {
    socket: any;
}
const initialState: ISocket = {
    socket: null,
};

const socketSlice = createSlice({
    initialState,
    name: "socket",
    reducers: {
        setSocket: (state) => {
            state.socket = io(apiUrl);
        },
        removeSocket: (state) => {
            state.socket = null;
        },
    },
});

export const { removeSocket, setSocket } = socketSlice.actions;
export default socketSlice.reducer;
