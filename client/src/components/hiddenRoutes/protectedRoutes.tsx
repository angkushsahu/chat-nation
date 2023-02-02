import { Navigate, Outlet } from "react-router-dom";
import { useGetUserQuery } from "store/apiQueries";
import routes from "components/app/routes";
import LoadingPage from "components/common/loading";
import { useAppSelector } from "store";

interface ProtectedRoutesProps {
    isAuthRequired: boolean;
}

const ProtectedRoutes = ({ isAuthRequired }: ProtectedRoutesProps) => {
    const { data, isLoading } = useGetUserQuery();
    const { auth } = useAppSelector((state) => state.authSlice);
    const isLoggedIn: boolean = data?.success && data.user && auth ? true : false;

    if (isLoading) {
        return <LoadingPage />;
    } else if ((isLoggedIn && isAuthRequired) || (!isLoggedIn && !isAuthRequired)) {
        return <Outlet />;
    } else if (!isLoggedIn && isAuthRequired) {
        return <Navigate to={routes.login} replace={true} />;
    } else {
        return <Navigate to={routes.allChats} replace={true} />;
    }
};

export default ProtectedRoutes;
