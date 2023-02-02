import styles from "./styles.module.scss";
import homeImage from "assets/homeImage.svg";
import homeBackground from "assets/homeBackground.svg";
import { Link } from "react-router-dom";
import routes from "components/app/routes";

const HomePage = () => {
    return (
        <main className={styles.home}>
            <img
                src={homeBackground}
                alt="home background"
                loading="lazy"
                className={styles.homeBackground}
            />
            <section>
                <h1>Chat Nation</h1>
                <h2>Stay connected with loved ones through seamless conversations</h2>
                <div className={styles.buttonGroup}>
                    <Link to={routes.login} className={styles.loginButton}>
                        <button type="button">Login</button>
                    </Link>
                    <Link to={routes.signup} title="Signup" className={styles.signupLink}>
                        New user
                    </Link>
                </div>
            </section>
            <section>
                <img src={homeImage} alt="home" loading="lazy" className={styles.homeImage} />
            </section>
        </main>
    );
};

export default HomePage;
