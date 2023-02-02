import apiQueries from "./api";
import { IRequest, IUpdateAccount, IUser } from "types";

export const userApi = apiQueries.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IRequest & { user: IUser }, void>({
            query: () => {
                return {
                    url: "/user",
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            providesTags: ["User"],
        }),
        visitProfile: builder.query<IRequest & { user: IUser }, { id: string }>({
            query: ({ id }) => {
                return {
                    url: `/user/${id}`,
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
        }),
        getAllUsers: builder.query<IRequest & { users: IUser[] }, { query: string }>({
            query: ({ query }) => {
                return {
                    url: `/user/get-all-users?${query}`,
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
        }),
        logout: builder.mutation<IRequest, void>({
            query: () => {
                return {
                    url: "/user/logout",
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            invalidatesTags: ["User"],
        }),
        changePassword: builder.mutation<IRequest & { user: IUser }, { password: string }>({
            query: (body) => {
                return {
                    url: "/user/change-password",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
        }),
        deleteAccount: builder.mutation<IRequest, void>({
            query: () => {
                return {
                    url: "/user/delete",
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            invalidatesTags: ["User"],
        }),
        updateAccount: builder.mutation<IRequest & { user: IUser }, IUpdateAccount>({
            query: (body) => {
                return {
                    url: "/user/update",
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["User"],
        }),
        removeAvatar: builder.mutation<IRequest & { user: IUser }, void>({
            query: () => {
                return {
                    url: "/user/remove-avatar",
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                };
            },
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useGetAllUsersQuery,
    useGetUserQuery,
    useLogoutMutation,
    useUpdateAccountMutation,
    useRemoveAvatarMutation,
    useLazyGetAllUsersQuery,
    useVisitProfileQuery,
} = userApi;
