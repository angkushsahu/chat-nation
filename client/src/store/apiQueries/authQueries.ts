import apiQueries from "./api";
import { IForgotPassword, ILogin, IRequest, IResetPassword, ISignup, IUser } from "types";

export const authApi = apiQueries.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<IRequest & { user: IUser }, ILogin>({
            query: (body) => {
                return {
                    url: "/auth/login",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["User"],
        }),
        signup: builder.mutation<IRequest & { user: IUser }, ISignup>({
            query: (body) => {
                return {
                    url: "/auth/signup",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
            invalidatesTags: ["User"],
        }),
        forgotPassword: builder.mutation<IRequest, IForgotPassword>({
            query: (body) => {
                return {
                    url: "/auth/forgot-password",
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body,
                };
            },
        }),
        resetPassword: builder.mutation<IRequest, IResetPassword>({
            query: (body) => {
                return {
                    url: `/auth/reset-password/${body.resetId}`,
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: { password: body.password },
                };
            },
        }),
    }),
});

export const { useLoginMutation, useSignupMutation, useForgotPasswordMutation, useResetPasswordMutation } = authApi;
