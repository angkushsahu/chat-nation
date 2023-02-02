import styles from "./styles.module.scss";
import { useEffect, useState } from "react";
import MessageSectionHeader from "./header";
import MessageBody from "./body";
import SendMessage from "./sendMessage";
import UserDetails from "./userDetails";
import Welcome from "./welcome";
import { useAppSelector } from "store";
import { useGetGroupChatQuery } from "store/apiQueries";

const Messages = () => {
    const [typing, setTyping] = useState("");
    const [toggleUserDetails, setToggleUserDetails] = useState(false);
    const { chat: selectedChat } = useAppSelector((state) => state.showMessagesSlice);
    const { socket } = useAppSelector((state) => state.socketSlice);
    const { data } = useGetGroupChatQuery({ chatId: `${selectedChat?._id}` });

    useEffect(() => {
        if (selectedChat) {
            socket.emit("join-room", selectedChat._id);
        }
    }, [selectedChat, socket]);

    return (
        <section className={`${styles.messageSection} ${selectedChat && data?.chat ? styles.show : ""}`}>
            {data?.chat && selectedChat ? (
                <>
                    <MessageSectionHeader setToggleUserDetails={setToggleUserDetails} chat={data.chat} />
                    <MessageBody chatId={data.chat._id} setTyping={setTyping} typing={typing} />
                    <SendMessage chatId={data.chat._id} />
                    <UserDetails chat={data.chat} toggleUserDetails={toggleUserDetails} setToggleUserDetails={setToggleUserDetails} />
                </>
            ) : (
                <Welcome />
            )}
        </section>
    );
};

export default Messages;
