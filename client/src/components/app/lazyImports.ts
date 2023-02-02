import { lazy } from "react";

export const HomePage = lazy(() => import("components/common/homePage"));
export const SignupPage = lazy(() => import("components/features/auth/signup"));
export const LoginPage = lazy(() => import("components/features/auth/login"));
export const ForgotPassword = lazy(() => import("components/features/auth/forgotPassword"));
export const ResetPassword = lazy(() => import("components/features/auth/resetPassword"));
export const ChangePassword = lazy(() => import("components/features/auth/changePassword"));
export const ChatPage = lazy(() => import("components/features/chat"));
export const NewChat = lazy(() => import("components/features/users"));
export const Profile = lazy(() => import("components/features/profile"));
export const UpdateProfile = lazy(() => import("components/features/auth/updateProfile"));
export const VisitProfile = lazy(() => import("components/features/users/user"));
