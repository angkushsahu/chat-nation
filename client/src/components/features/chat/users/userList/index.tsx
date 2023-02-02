import styles from "../styles.module.scss";
import { useLocation } from "react-router-dom";
import routes from "components/app/routes";
import ChatBanner from "./chatBanner";
import { useFetchChatsQuery } from "store/apiQueries";
import LoadingComponent from "components/common/loading/loadingComponent";
import { IChat, IMsg, IUsersProps } from "types";
import { useAppSelector } from "store";
import { useEffect, useState } from "react";

const UsersList = ({ search }: IUsersProps) => {
    const [chatList, setChatList] = useState<IChat[]>([]);
    const [ogChatList, setOgChatList] = useState<IChat[]>([]);
    const { user: you } = useAppSelector((state) => state.authSlice);
    const { socket } = useAppSelector((state) => state.socketSlice);
    const { pathname } = useLocation();
    const query =
        routes.allChats === pathname ? "all" : routes.groupChat === pathname ? "group" : routes.individualChat === pathname ? "individual" : "";
    const { isLoading, data, refetch } = useFetchChatsQuery({ query });

    useEffect(() => {
        if (data?.success) {
            setChatList(data.chats);
            setOgChatList(data.chats);
        }
    }, [data]);
    useEffect(() => {
        if (socket) {
            socket.on("message-received", (newMessage: IMsg) => {
                if (data) {
                    refetch();
                    console.log("Refetching for you");
                }
            });
        }
        console.log("Running useEffect with all socket events");
    });

    useEffect(() => {
        const chatArr = search
            ? ogChatList.filter((item) => {
                  if (item.isGroupChat) {
                      return item.chatName.toLowerCase().includes(search.toLowerCase());
                  } else {
                      const receiver = item.users.filter((user) => user._id !== you?._id);
                      return (
                          receiver[0].name.toLowerCase().includes(search.toLowerCase()) ||
                          receiver[0].userName.toLowerCase().includes(search.toLowerCase())
                      );
                  }
              })
            : ogChatList;

        setChatList(chatArr);
    }, [search, ogChatList, you]);

    if (isLoading) {
        return (
            <div className={styles.loading_component}>
                <LoadingComponent />
            </div>
        );
    } else if (data && data.success && data.chats) {
        return (
            <section className={styles.users_list}>
                {chatList.map((chat) => (
                    <ChatBanner key={chat._id} chat={chat} />
                ))}
            </section>
        );
    } else {
        return <></>;
    }
};

export default UsersList;
