import styles from "./styles.module.scss";
import { Link, Outlet } from "react-router-dom";
import { BsChatSquareTextFill } from "react-icons/bs";
import { FaUser, FaUsers, FaUserCircle } from "react-icons/fa";
import { MdKeyboardBackspace } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import routes from "components/app/routes";
import { useAppDispatch, useAppSelector } from "store";
import { hideMessage } from "store/state";

const Header = () => {
    const { user } = useAppSelector((state) => state.authSlice);
    const { chat } = useAppSelector((state) => state.showMessagesSlice);
    const { socket } = useAppSelector((state) => state.socketSlice);
    const dispatch = useAppDispatch();

    const onRoomLeave = () => {
        dispatch(hideMessage());
        socket.emit("leave-room", chat?._id);
    };

    return (
        <>
            <section className={styles.navigationWrapper}>
                <nav className={styles.navigation}>
                    <Link to={routes.allChats} title="All Chats">
                        <BsChatSquareTextFill />
                    </Link>
                    <Link to={routes.individualChat} title="One-on-One Chat">
                        <FaUser />
                    </Link>
                    <Link to={routes.groupChat} title="Group Chats">
                        <FaUsers />
                    </Link>
                    <Link to={routes.newChat} title="New Chat">
                        <IoMdAddCircle />
                    </Link>
                    <Link to={routes.profile}>
                        {user?.pic ? <img src={user.pic} alt="user avatar" loading="lazy" title="Profile" /> : <FaUserCircle title="Profile" />}
                    </Link>
                </nav>
                {chat ? <MdKeyboardBackspace title="Back" onClick={onRoomLeave} /> : null}
            </section>
            <Outlet />
        </>
    );
};

export default Header;
