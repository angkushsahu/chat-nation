import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { FaUserCircle } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { useAppSelector } from "store";
import { IChat } from "types";

interface MessageSectionHeaderProps {
    setToggleUserDetails: Dispatch<SetStateAction<boolean>>;
    chat: IChat;
}

const MessageSectionHeader = ({ setToggleUserDetails, chat }: MessageSectionHeaderProps) => {
    const { user: you } = useAppSelector((state) => state.authSlice);
    let image: string[] = [];
    let chatName = "";
    let userName = "";
    if (chat?.isGroupChat) {
        image.push(chat.pic);
        chatName = chat.chatName;
    } else {
        const filteredChat = chat?.users.filter((user) => user._id !== you?._id);
        if (filteredChat?.length) {
            const chatAvatar = filteredChat[0].pic;
            image.push(chatAvatar);
            chatName = filteredChat[0].name;
            userName = filteredChat[0].userName;
        }
    }

    return (
        <header className={styles.messageHeader}>
            <div>
                {image.length && image[0] ? (
                    <img src={image[0]} alt="user avatar" loading="lazy" className={styles.userAvatar} />
                ) : (
                    <FaUserCircle className={styles.userAvatar} />
                )}
                <div>
                    <h3 className={styles.userName}>{chatName}</h3>
                    {userName ? <p className={styles.originalName}>{userName}</p> : null}
                </div>
            </div>
            <div>
                <BsThreeDots onClick={() => setToggleUserDetails((prev) => !prev)} />
            </div>
        </header>
    );
};

export default MessageSectionHeader;
