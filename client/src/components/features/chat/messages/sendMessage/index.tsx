import styles from "./styles.module.scss";
import { ChangeEvent, FormEvent, useState } from "react";
import Picker, { EmojiClickData } from "emoji-picker-react";
import { BsFillEmojiSunglassesFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useAddMessageMutation } from "store/apiQueries/messageQueries";
import { toast } from "react-toastify";
import { useAppSelector } from "store";

interface SendMessageProps {
    chatId: string;
}

const SendMessage = ({ chatId }: SendMessageProps) => {
    const { socket } = useAppSelector((state) => state.socketSlice);
    const { user } = useAppSelector((state) => state.authSlice);
    const [message, setMessage] = useState("");
    const [showEmojiPalette, setShowEmojiPalette] = useState(false);
    const [addMessage] = useAddMessageMutation();

    const onSendMessage = async (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            return;
        }
        try {
            const response = await addMessage({ chatId, content: message }).unwrap();
            if (response.success) {
                setMessage("");
                socket.emit("new-message", { chatId, message: response.msg });
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    const onTyping = (e: ChangeEvent<HTMLInputElement>) => {
        socket.emit("typing", { chatId, userName: user?.userName });
        setMessage(e.target.value);
        setTimeout(() => {
            socket.emit("stop-typing", { chatId, userName: user?.userName });
        }, 2000);
    };

    const onEmojiClick = (e: EmojiClickData) => {
        const { emoji } = e;
        setMessage((prev) => prev + emoji);
    };

    return (
        <form onSubmit={onSendMessage} className={styles.sendMessage}>
            {showEmojiPalette ? (
                <RxCross2 className={styles.toggleEmoji} onClick={() => setShowEmojiPalette(false)} />
            ) : (
                <BsFillEmojiSunglassesFill className={styles.toggleEmoji} onClick={() => setShowEmojiPalette(true)} />
            )}
            {showEmojiPalette ? <Picker onEmojiClick={onEmojiClick} autoFocusSearch /> : null}
            <input
                type="text"
                name="message"
                id="message"
                placeholder="Enter a message ...."
                title="Enter a message ...."
                value={message}
                onChange={onTyping}
            />
            <button type="submit" title="Send Message" disabled={!message.length} className={message.trim() ? styles.show : styles.hide}>
                <IoMdSend className={styles.sendIcon} />
            </button>
        </form>
    );
};

export default SendMessage;
