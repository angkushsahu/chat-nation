import { Navigate, Outlet } from "react-router-dom";
import { useGetUserQuery } from "store/apiQueries";
import routes from "components/app/routes";
import LoadingPage from "components/common/loading";
import { useEffect } from "react";

const PublicRoutes = () => {
    const { data, isLoading } = useGetUserQuery();

    useEffect(() => {}, [data]);

    if (isLoading) {
        return <LoadingPage />;
    } else if (data?.success && data.user) {
        return <Navigate to={routes.allChats} replace={true} />;
    } else {
        return <Outlet />;
    }
};

export default PublicRoutes;
