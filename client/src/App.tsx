import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import LoadingPage from "components/common/loading";
import routing from "components/app/routing";
import { useGetUserQuery } from "store/apiQueries";
import { setSocket, setUser } from "store/state";
import { useAppDispatch, useAppSelector } from "store";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
    const dispatch = useAppDispatch();
    const { socket } = useAppSelector((state) => state.socketSlice);
    const { data } = useGetUserQuery();
    useEffect(() => {
        dispatch(setSocket());
    }, []);
    useEffect(() => {
        if (data?.user && socket) {
            dispatch(setUser({ user: data.user }));
            socket.emit("setup-room", data.user);
        }
    }, [data?.user, dispatch, socket]);

    return (
        <div className="root">
            <Suspense fallback={<LoadingPage />}>
                <RouterProvider router={routing} />
            </Suspense>
            <ToastContainer position="top-center" theme="dark" />
        </div>
    );
};

export default App;
