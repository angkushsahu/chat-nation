import styles from "../styles.module.scss";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { IChat, IMsg, IUser } from "types";
import { useAppDispatch, useAppSelector } from "store";
import { showMessage } from "store/state";

interface UserBannerProps {
    chat: IChat;
}

const UserBanner = ({ chat }: UserBannerProps) => {
    const [notification, setNotification] = useState(false);
    const dispatch = useAppDispatch();
    const { chat: currentChat } = useAppSelector((state) => state.showMessagesSlice);
    const { socket } = useAppSelector((state) => state.socketSlice);
    const { user: you } = useAppSelector((state) => state.authSlice);

    const getUserName = (users: IUser[]) => {
        const userName = users.filter((user) => user._id !== you?._id);
        return userName[0].userName;
    };

    useEffect(() => {
        if (socket) {
            socket.on("message-received", (newMessage: IMsg) => {
                if ((!currentChat || currentChat._id !== chat._id) && newMessage.chat._id === chat._id) {
                    setNotification(true);
                } else if (notification || currentChat?._id === chat._id) {
                    setNotification(false);
                }
            });
        }
    });

    useEffect(() => {
        if (currentChat?._id === chat._id) {
            setNotification(false);
        }
    }, [currentChat, chat]);

    return (
        <article
            className={`${styles.userBanner} ${currentChat?._id === chat._id ? styles.active : ""}`}
            onClick={() => dispatch(showMessage({ chat }))}
        >
            <div className={styles.avatarAndName}>
                <div className={styles.userAvatar}>{chat?.pic ? <img src={chat?.pic} alt="user avatar" loading="lazy" /> : <FaUserCircle />}</div>
                <div className={styles.nameAndLastMessage}>
                    <p className={styles.name}>{chat.isGroupChat ? chat.chatName : getUserName(chat.users)}</p>
                    {chat.latestMessage ? (
                        <p className={styles.lastMessage}>
                            {chat.latestMessage.content?.length <= 25
                                ? chat.latestMessage.content
                                : `${chat.latestMessage.content?.substring(0, 25)}....`}
                        </p>
                    ) : null}
                </div>
            </div>
            {notification ? <span className={styles.notification_pill}></span> : null}
        </article>
    );
};

export default UserBanner;
