import styles from "./styles.module.scss";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useLazyAccessChatQuery, useVisitProfileQuery } from "store/apiQueries";
import LoadingPage from "components/common/loading";
import ListAllGroups from "../listAllGroups";
import { toast } from "react-toastify";

const UserProfile = () => {
    const { id } = useParams();
    const [toggleGroupBar, setToggleGroupBar] = useState(false);
    const [accessChat, { isLoading: accessChatLoading }] = useLazyAccessChatQuery();
    const { data, isLoading } = useVisitProfileQuery({ id: id! });

    const onStartConversation = async () => {
        try {
            const response = await accessChat({ userId: id! }).unwrap();
            if (response.success) {
                toast.success(response.message);
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    } else if (data?.success && data.user) {
        return (
            <section className={styles.visit_profile}>
                <h2>{data.user.name}</h2>
                {data.user.pic ? (
                    <img src={data.user.pic} alt="user avatar" loading="lazy" className={styles.avatar} />
                ) : (
                    <FaUserCircle className={styles.avatar} />
                )}
                <p>
                    <strong>Username : </strong>
                    {data.user.userName}
                </p>
                <p>
                    <strong>E-mail : </strong>
                    {data.user.email}
                </p>
                <button type="button" className={styles.start_conversation} onClick={onStartConversation} disabled={accessChatLoading}>
                    Start Conversation
                </button>
                <button type="button" className={styles.add_to_group} onClick={() => setToggleGroupBar((prev) => !prev)}>
                    Add to Group
                </button>
                <ListAllGroups userId={data.user._id} toggleGroupBar={toggleGroupBar} setToggleGroupBar={setToggleGroupBar} />
            </section>
        );
    } else {
        return <></>;
    }
};

export default UserProfile;
