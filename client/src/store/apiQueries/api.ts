import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiUrl } from "store/apiUrl";

const apiQueries = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: `${apiUrl}/api` }),
    endpoints: () => ({}),
    tagTypes: ["Message", "Chat", "Chats", "User"],
});

export default apiQueries;
