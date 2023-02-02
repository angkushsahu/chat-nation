import styles from "./styles.module.scss";
import Messages from "./messages";
import Users from "./users";

const ChatPage = () => {
    return (
        <main className={styles.chats}>
            <Users />
            <Messages />
        </main>
    );
};

export default ChatPage;
