import { Navigate, Outlet } from "react-router-dom";
import { useGetUserQuery } from "store/apiQueries";
import routes from "components/app/routes";
import LoadingPage from "components/common/loading";
import { useEffect } from "react";

const PublicRoutes = () => {
    const { data, isLoading } = useGetUserQuery();
    console.log("Public routes");

    useEffect(() => {
        console.log("Running useEffect for public routes");
    }, [data]);

    if (isLoading) {
        return <LoadingPage />;
    } else if (data?.success && data.user) {
        console.log("Public routes data success");
        console.log(`public routes`, data);
        return <Navigate to={routes.allChats} replace={true} />;
    } else {
        console.log("Public routes data failure");
        return <Outlet />;
    }
};

export default PublicRoutes;
