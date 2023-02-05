import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiQueries = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: () => ({}),
    tagTypes: ["Message", "Chat", "Chats", "User"],
});

export default apiQueries;
