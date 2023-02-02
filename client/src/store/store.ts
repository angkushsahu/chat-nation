import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { apiQueries } from "./apiQueries";
import { authSlice, showMessagesSlice, socketSlice } from "./state";

const store = configureStore({
    reducer: {
        authSlice,
        showMessagesSlice,
        socketSlice,
        [apiQueries.reducerPath]: apiQueries.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(apiQueries.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
