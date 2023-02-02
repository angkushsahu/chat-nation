import styles from "./styles.module.scss";
import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { FaCrown, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { IChat } from "types";
import { useAppSelector } from "store";
import { useAddGroupLogoMutation, useRemoveFromGroupMutation, useRenameGroupMutation } from "store/apiQueries";
import { toast } from "react-toastify";

interface UserDetailsProps {
    toggleUserDetails: boolean;
    setToggleUserDetails: Dispatch<SetStateAction<boolean>>;
    chat: IChat;
}

const UserDetails = ({ toggleUserDetails, setToggleUserDetails, chat }: UserDetailsProps) => {
    const [removeFromGroup] = useRemoveFromGroupMutation();
    const [renameGroup, { isLoading: renameLoading }] = useRenameGroupMutation();
    const [addGroupLogo, { isLoading: logoLoading }] = useAddGroupLogoMutation();
    const [editing, setEditing] = useState(false);
    const [logo, setLogo] = useState("");
    const [chatName, setChatName] = useState(chat.chatName);
    const { user: you } = useAppSelector((state) => state.authSlice);
    const users = chat.users.filter((user) => user._id !== you?._id);
    const user = users[0];

    const onMemberRemoval = async (userId: string) => {
        try {
            const response = await removeFromGroup({ chatId: chat._id, userId }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    const updateImage = (e: ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files![0];
        if (!image) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            setLogo(String(reader.result));
        };
    };

    const onEdit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            if (chat.chatName !== chatName) {
                const groupNameUpdateResponse = await renameGroup({ chatId: chat._id, chatName }).unwrap();
                if (groupNameUpdateResponse.success) {
                    toast.success(groupNameUpdateResponse.message);
                }
            }
            if (logo) {
                const imageUpdateResponse = await addGroupLogo({ chatId: chat._id, image: logo }).unwrap();
                if (imageUpdateResponse.success) {
                    toast.success(imageUpdateResponse.message);
                }
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    return (
        <aside className={`${styles.userDetails} ${toggleUserDetails ? styles.show : styles.hide}`}>
            <RxCross2 onClick={() => setToggleUserDetails(!toggleUserDetails)} className={styles.close} />
            {chat.isGroupChat ? (
                <>
                    {editing ? (
                        <form onSubmit={onEdit}>
                            <label htmlFor="logo">
                                <div>
                                    {logo || chat.pic ? (
                                        <img src={logo ? logo : chat.pic} alt="group logo" loading="lazy" className={styles.avatar} />
                                    ) : (
                                        <FaUserCircle className={styles.avatar} />
                                    )}
                                </div>
                            </label>
                            <input type="file" accept="image/*" onChange={updateImage} name="logo" id="logo" />
                            <input
                                type="text"
                                name="chatName"
                                id="chatName"
                                onChange={(e) => setChatName(e.target.value)}
                                value={chatName}
                                placeholder="Enter a name for this chat group"
                            />
                            <button type="submit" className={styles.update_form} disabled={renameLoading || logoLoading}>
                                Update
                            </button>
                            <button type="button" className={styles.cancel_form} onClick={() => setEditing(false)}>
                                Cancel
                            </button>
                        </form>
                    ) : (
                        <>
                            <div>
                                {chat.pic ? (
                                    <img src={chat.pic} alt="group logo" loading="lazy" className={styles.avatar} />
                                ) : (
                                    <FaUserCircle className={styles.avatar} />
                                )}
                            </div>
                            <div className={styles.name_edit}>
                                <h2 className="text-center">{chat.chatName}</h2>
                                <FaPencilAlt className={styles.edit} onClick={() => setEditing(true)} />
                            </div>
                        </>
                    )}
                    <section className={styles.group_members}>
                        {users.map((user) => (
                            <div key={user._id} className={styles.group_member}>
                                <div className={styles.member_info}>
                                    {user.pic ? (
                                        <img src={user.pic} alt={`${user.name} avatar`} loading="lazy" className={styles.group_member__avatar} />
                                    ) : (
                                        <FaUserCircle className={styles.group_member__avatar} />
                                    )}
                                    <div>
                                        <p className={styles.thick}>{user.name.length > 25 ? user.name.substring(0, 25) + "..." : user.name}</p>
                                        <p className={styles.light}>
                                            a.k.a {user.userName.length > 20 ? user.userName.substring(0, 20) + "..." : user.userName}
                                        </p>
                                    </div>
                                </div>
                                {you?._id === chat.groupAdmin?._id ? (
                                    <AiFillDelete className={styles.delete_icon} onClick={() => onMemberRemoval(user._id)} />
                                ) : null}
                                {user._id === chat.groupAdmin?._id ? <FaCrown className={styles.crown_icon} /> : null}
                            </div>
                        ))}
                    </section>
                </>
            ) : (
                <>
                    <div>
                        {user.pic ? (
                            <img src={user.pic} alt="user avatar" loading="lazy" className={styles.avatar} />
                        ) : (
                            <FaUserCircle className={styles.avatar} />
                        )}
                    </div>
                    <h2 className="text-center">{user.name}</h2>
                    <p className="text-center">a.k.a. {user.userName}</p>
                    <p className={`text-center ${styles.lighten}`}>{user.email}</p>
                </>
            )}
        </aside>
    );
};

export default UserDetails;
