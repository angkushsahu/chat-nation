import styles from "./styles.module.scss";
import { FaUserCircle } from "react-icons/fa";
import { useGetAllMessagesQuery } from "store/apiQueries/messageQueries";
import LoadingPage from "components/common/loading";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useAppSelector } from "store";
import { IMsg } from "types";

interface SendMessageProps {
    chatId: string;
    typing: string;
    setTyping: Dispatch<SetStateAction<string>>;
}

const MessageBody = ({ chatId, setTyping, typing }: SendMessageProps) => {
    const [messages, setMessages] = useState<IMsg[]>([]);
    const { user } = useAppSelector((state) => state.authSlice);
    const { chat } = useAppSelector((state) => state.showMessagesSlice);
    const { socket } = useAppSelector((state) => state.socketSlice);
    const { data, isLoading } = useGetAllMessagesQuery({ chatId });
    const scrollToBottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottomRef.current?.scrollIntoView();
    }, []);
    useEffect(() => {
        if (data?.success) {
            setMessages(data.msgs);
        }
    }, [data]);
    useEffect(() => {
        if (socket) {
            socket.on("message-received", (newMessage: IMsg) => {
                if (!chat || chat._id !== chatId) {
                    // notification to that particular chat
                } else {
                    setMessages([...messages, newMessage]);
                }
                scrollToBottomRef.current?.scrollIntoView();
            });
        }
    });
    useEffect(() => {
        if (socket) {
            socket.on("user-is-typing", (userName: string) => {
                setTyping(userName);
                scrollToBottomRef.current?.scrollIntoView();
            });
            socket.on("user-stopped-typing", (userName: string) => {
                setTyping("");
                scrollToBottomRef.current?.scrollIntoView();
            });
        }
    });

    if (isLoading) {
        return <LoadingPage />;
    } else if (data && data.success) {
        return (
            <section className={styles.body}>
                {messages?.map((message) => {
                    const messageByMe = message.sender._id === user?._id;
                    return (
                        <div
                            key={message._id}
                            className={`${styles.message_box__container} ${messageByMe ? styles.messageByMe : styles.messageByThem}`}
                        >
                            {messageByMe || !chat?.isGroupChat ? null : message.sender.pic ? (
                                <img src={message.sender.pic} alt={`${message.sender.name}'s avatar`} className={styles.user_avatar} />
                            ) : (
                                <FaUserCircle className={styles.user_avatar} />
                            )}
                            <div className={`${styles.messageBox} ${messageByMe ? styles.messageByMe : styles.messageByThem}`}>
                                {messageByMe ? null : <p className={styles.user_name}>{message.sender.name}</p>}
                                <p>{message.content}</p>
                            </div>
                        </div>
                    );
                })}
                {typing ? (
                    <div className={`${styles.message_box__container} ${styles.messageByThem} ${styles.typing_animation}`}>
                        <div className={`${styles.messageBox} ${styles.messageByThem} ${styles.typing_animation}`}>{typing} is typing ....</div>
                    </div>
                ) : null}
                <div ref={scrollToBottomRef}></div>
            </section>
        );
    }
    return <></>;
};

export default MessageBody;
