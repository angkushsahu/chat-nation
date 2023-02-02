import styles from "./styles.module.scss";
import { useState } from "react";
import ChatListHeader from "./header";
import UsersList from "./userList";
import { useAppSelector } from "store";

const ChatList = () => {
    const [search, setSearch] = useState("");
    const { chat } = useAppSelector((state) => state.showMessagesSlice);

    return (
        <main className={`${styles.users} ${chat ? "" : styles.show}`}>
            <ChatListHeader search={search} setSearch={setSearch} />
            <UsersList search={search} setSearch={setSearch} />
        </main>
    );
};

export default ChatList;
