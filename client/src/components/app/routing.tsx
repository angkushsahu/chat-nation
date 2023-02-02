import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import routes from "./routes";
import Navigation from "components/common/navigation";
import * as Components from "./lazyImports";
import { ProtectedRoutes } from "components/hiddenRoutes";

const routing = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/">
            <Route element={<ProtectedRoutes isAuthRequired={false} />}>
                <Route path={routes.home} element={<Components.HomePage />} />
                <Route path={routes.signup} element={<Components.SignupPage />} />
                <Route path={routes.login} element={<Components.LoginPage />} />
                <Route path={routes.forgotPassword} element={<Components.ForgotPassword />} />
                <Route path={routes.resetPassword} element={<Components.ResetPassword />} />
            </Route>
            <Route element={<ProtectedRoutes isAuthRequired={true} />}>
                <Route path={routes.updateProfile} element={<Components.UpdateProfile />} />
                <Route element={<Navigation />}>
                    <Route path={routes.changePassword} element={<Components.ChangePassword />} />
                    <Route path={routes.allChats} element={<Components.ChatPage />} />
                    <Route path={routes.groupChat} element={<Components.ChatPage />} />
                    <Route path={routes.individualChat} element={<Components.ChatPage />} />
                    <Route path={routes.newChat} element={<Components.NewChat />} />
                    <Route path={routes.profile} element={<Components.Profile />} />
                    <Route path={routes.visitProfile} element={<Components.VisitProfile />} />
                </Route>
            </Route>
            <Route path="*" element={<Navigate to={routes.home} replace={true} />} />
        </Route>
    )
);

export default routing;
