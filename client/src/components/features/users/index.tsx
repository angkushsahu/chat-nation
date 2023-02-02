import styles from "./styles.module.scss";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearchAlt2 } from "react-icons/bi";
import { FaUserCircle } from "react-icons/fa";
import { useCreateGroupChatMutation, useLazyGetAllUsersQuery } from "store/apiQueries";
import LoadingComponent from "components/common/loading/loadingComponent";
import { IUser } from "types";
import { toast } from "react-toastify";
import LoadingPage from "components/common/loading";
import routes from "components/app/routes";

const NewChat = () => {
    const [getAllUsers, { isLoading }] = useLazyGetAllUsersQuery();
    const [createGroupChat, { isLoading: loadingGroupChat }] = useCreateGroupChatMutation();
    const [users, setUsers] = useState<IUser[]>([]);
    const [search, setSearch] = useState("");
    const [groupMode, setGroupMode] = useState(false);
    const [selectUsers, setSelectUsers] = useState<string[]>([]);
    const searchRef = useRef<HTMLInputElement | null>(null);
    const navigate = useNavigate();

    const searchPeople = async (e: FormEvent) => {
        e.preventDefault();
        if (!search) {
            setUsers([]);
            return;
        }
        try {
            const response = await getAllUsers({ query: `search=${search}` }).unwrap();
            if (response.success) {
                setUsers(response.users);
            }
        } catch (err: any) {}
    };

    const onUserClick = (id: string) => {
        if (groupMode) {
            if (!selectUsers.includes(id)) {
                setSelectUsers([...selectUsers, id]);
            } else {
                const newUsers = selectUsers.filter((userId) => userId !== id);
                setSelectUsers(newUsers);
            }
        } else {
            navigate(`/user/${id}`);
        }
    };

    const onGroupCreation = async () => {
        if (selectUsers.length < 2) {
            toast.warn("Select at least 2 members to create a group");
            return;
        }
        const groupName = window.prompt("Enter a name for this group");
        try {
            const response = await createGroupChat({ groupName: groupName!, users: selectUsers }).unwrap();
            if (response.success) {
                toast.success(response.message);
                navigate(routes.allChats);
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    if (loadingGroupChat) {
        return <LoadingPage />;
    } else {
        return (
            <main className={styles.newChat}>
                <header className={styles.searchHeader}>
                    <form className={styles.searchBox} onSubmit={searchPeople} onClick={(e) => searchRef.current?.focus()} title="Search users ....">
                        <BiSearchAlt2 />
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="searchInput"
                            placeholder="Search users...."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            ref={searchRef}
                        />
                        <button type="submit" className={styles.search_button}>
                            <BiSearchAlt2 />
                        </button>
                    </form>
                    <button
                        type="button"
                        className={`${styles.new_group} ${groupMode ? styles.active : ""}`}
                        onClick={() => setGroupMode((prev) => !prev)}
                    >
                        {groupMode ? `Select Users (${selectUsers.length})` : "New Group"}
                    </button>
                    {groupMode && selectUsers.length >= 2 ? (
                        <button type="button" className={styles.create_group} onClick={onGroupCreation}>
                            Create Group
                        </button>
                    ) : null}
                </header>
                <section className={styles.listAllUsers}>
                    {isLoading ? (
                        <div className={styles.loading_component}>
                            <LoadingComponent />
                        </div>
                    ) : (
                        users?.map((user) => (
                            <article
                                key={user._id}
                                className={`${styles.users} ${selectUsers.includes(user._id) && groupMode ? styles.active : ""}`}
                                onClick={() => onUserClick(user._id)}
                            >
                                {user?.pic ? (
                                    <img src={user.pic} alt="user avatar" loading="lazy" className={styles.avatar} />
                                ) : (
                                    <FaUserCircle className={styles.avatar} />
                                )}
                                <div className={styles.nameAndEmail}>
                                    <p className={styles.name}>
                                        {user.name} <span className={styles.lighten}>(john_doe)</span>
                                    </p>
                                    <p className={styles.email}>{user.email}</p>
                                </div>
                            </article>
                        ))
                    )}
                </section>
            </main>
        );
    }
};

export default NewChat;
