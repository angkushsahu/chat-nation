import styles from "./styles.module.scss";
import { useRef } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { IUsersProps } from "types";

const ChatListHeader = ({ search, setSearch }: IUsersProps) => {
    const searchRef = useRef<HTMLInputElement | null>(null);

    return (
        <header className={styles.userHeader}>
            <form className={styles.searchBox} onSubmit={(e) => e.preventDefault()} onClick={(e) => searchRef.current?.focus()}>
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
            </form>
        </header>
    );
};

export default ChatListHeader;
