import apiQueries from "./api";
import { IAddMessge, IMsg, IRequest } from "types";

export const userApi = apiQueries.injectEndpoints({
    endpoints: (builder) => ({
        addMessage: builder.mutation<IRequest & { msg: IMsg }, IAddMessge>({
            query: (body) => {
                return {
                    url: "/message/add",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Message", "Chats"],
        }),
        getAllMessages: builder.query<IRequest & { msgs: IMsg[] }, { chatId: string }>({
            query: ({ chatId }) => {
                return {
                    url: `/message/fetch-messages/${chatId}`,
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            providesTags: ["Message"],
        }),
    }),
});

export const { useAddMessageMutation, useGetAllMessagesQuery } = userApi;
