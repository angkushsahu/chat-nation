import styles from "./styles.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import routes from "components/app/routes";
import { useDeleteAccountMutation, useLogoutMutation } from "store/apiQueries";
import LoadingPage from "../../common/loading";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "store";
import { removeUser } from "store/state";

const Profile = () => {
    const { user } = useAppSelector((state) => state.authSlice);
    const [logout, { isLoading: logoutLoading }] = useLogoutMutation();
    const [deleteAccount, { isLoading: deleteAccountLoading }] = useDeleteAccountMutation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const onDeleteAccount = async () => {
        const confirm = window.confirm("Are you sure you want to delete your account ?");
        if (!confirm) {
            return;
        }
        try {
            const response = await deleteAccount().unwrap();
            if (response.success) {
                toast.success(response.message);
                dispatch(removeUser());
                navigate(routes.login, { replace: true });
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    const onLogout = async () => {
        const confirm = window.confirm("Are you sure you want to logout ?");
        if (!confirm) {
            return;
        }
        try {
            const response = await logout().unwrap();
            if (response.success) {
                toast.success(response.message);
                dispatch(removeUser());
                navigate(routes.login, { replace: true });
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    if (logoutLoading || deleteAccountLoading) {
        return <LoadingPage />;
    } else {
        return (
            <main className={styles.profile}>
                <h1 className={styles.decorateUnderline}>Hello, {user?.name?.split(" ")[0]} 👋🏻</h1>
                <section className={styles.profileInfo}>
                    <h2 className={`text-center ${styles.centerLine}`}>Your Profile</h2>
                    <div className={styles.profileInfoDetails}>
                        <div>
                            {user?.pic ? (
                                <img src={user?.pic} alt="user avatar" loading="lazy" className={styles.avatar} />
                            ) : (
                                <FaUserCircle className={styles.avatar} />
                            )}
                        </div>
                        <div>
                            <p>
                                {user?.name}
                                <span className={styles.lighten}> a.k.a. {user?.userName}</span>
                            </p>
                            <p>{user?.email}</p>
                        </div>
                    </div>
                </section>
                <section className={styles.otherActions}>
                    <h2 className={`text-center ${styles.centerLine}`}>Other Actions</h2>
                    <div>
                        <Link to={routes.updateProfile}>
                            <button type="button">Update Profile</button>
                        </Link>
                        <Link to={routes.changePassword}>
                            <button type="button">Change Password</button>
                        </Link>
                        <button type="button" onClick={onLogout}>
                            Logout
                        </button>
                        <button type="button" onClick={onDeleteAccount}>
                            Delete Account
                        </button>
                    </div>
                </section>
            </main>
        );
    }
};

export default Profile;
