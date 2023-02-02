import styles from "./styles.module.scss";
import { Dispatch, SetStateAction } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import LoadingComponent from "components/common/loading/loadingComponent";
import { useAddToGroupMutation, useFetchChatsQuery } from "store/apiQueries";
import { useAppSelector } from "store";
import { toast } from "react-toastify";

interface ListAllGroupsProps {
    userId: string;
    toggleGroupBar: boolean;
    setToggleGroupBar: Dispatch<SetStateAction<boolean>>;
}

const ListAllGroups = ({ userId, toggleGroupBar, setToggleGroupBar }: ListAllGroupsProps) => {
    const { user } = useAppSelector((state) => state.authSlice);
    const { isLoading, data } = useFetchChatsQuery({ query: "group" });
    const [addToGroup, { isLoading: addingToGroup }] = useAddToGroupMutation();

    const onAddToGroup = async (chatId: string, chatName: string) => {
        try {
            const response = await addToGroup({ chatId, userId }).unwrap();
            if (response.success) {
                toast.success(`User added to group ${chatName}`);
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    return (
        <aside className={`${styles.groups_list} ${toggleGroupBar ? styles.show : styles.hide}`}>
            <RxCross2 className={styles.close} onClick={() => setToggleGroupBar(false)} />
            {isLoading || addingToGroup ? (
                <div className={styles.loading_component}>
                    <LoadingComponent />
                </div>
            ) : data && data.success ? (
                data.chats.map((chat) => {
                    if (chat.groupAdmin?._id === user?._id) {
                        return (
                            <article key={chat._id} className={styles.group} onClick={() => onAddToGroup(chat._id, chat.chatName)}>
                                {chat.pic ? (
                                    <img src={chat.pic} alt={`${chat.chatName} logo`} className={styles.group_logo} />
                                ) : (
                                    <FaUser className={styles.group_logo} />
                                )}
                                <p>{chat.chatName}</p>
                            </article>
                        );
                    } else {
                        return <></>;
                    }
                })
            ) : (
                <></>
            )}
        </aside>
    );
};

export default ListAllGroups;
