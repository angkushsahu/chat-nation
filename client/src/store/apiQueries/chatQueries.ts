import { IUpdateUsersInGroup, ICreateGroup, IRenameGroup, IRequest, IChat, IAddLogo } from "types";
import apiQueries from "./api";

export const chatApi = apiQueries.injectEndpoints({
    endpoints: (builder) => ({
        accessChat: builder.query<IRequest & { chat: IChat }, { userId: string }>({
            query: (body) => {
                return {
                    url: "/chat/access-chat",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            providesTags: ["Chat", "Chats"],
        }),
        fetchChats: builder.query<IRequest & { chats: IChat[] }, { query: string }>({
            query: ({ query }) => {
                return {
                    url: `/chat/fetch-chats/${query}`,
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            providesTags: ["Chats"],
        }),
        getGroupChat: builder.query<IRequest & { chat: IChat }, { chatId: string }>({
            query: ({ chatId }) => {
                return {
                    url: `/chat/group-chat/${chatId}`,
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            providesTags: ["Chat"],
        }),
        createGroupChat: builder.mutation<IRequest & { chat: IChat }, ICreateGroup>({
            query: (body) => {
                return {
                    url: "/chat/create-group-chat",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Chat", "Chats"],
        }),
        renameGroup: builder.mutation<IRequest & { chat: IChat }, IRenameGroup>({
            query: (body) => {
                return {
                    url: "/chat/rename-group",
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Chat", "Chats"],
        }),
        addGroupLogo: builder.mutation<IRequest & { chat: IChat }, IAddLogo>({
            query: (body) => {
                return {
                    url: "/chat/add-logo",
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Chat", "Chats"],
        }),
        addToGroup: builder.mutation<IRequest & { chat: IChat }, IUpdateUsersInGroup>({
            query: (body) => {
                return {
                    url: "/chat/add-to-group",
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Chat"],
        }),
        removeFromGroup: builder.mutation<IRequest & { chat: IChat }, IUpdateUsersInGroup>({
            query: (body) => {
                return {
                    url: "/chat/remove-from-group",
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Chat"],
        }),
        deleteGroup: builder.mutation<IRequest, { chatId: string }>({
            query: (body) => {
                return {
                    url: "/chat/delete",
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["Chat", "Chats"],
        }),
    }),
});

export const {
    useAccessChatQuery,
    useLazyAccessChatQuery,
    useAddToGroupMutation,
    useGetGroupChatQuery,
    useCreateGroupChatMutation,
    useDeleteGroupMutation,
    useFetchChatsQuery,
    useRemoveFromGroupMutation,
    useAddGroupLogoMutation,
    useRenameGroupMutation,
} = chatApi;
