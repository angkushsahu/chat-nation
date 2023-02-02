import styles from "./styles.module.scss";
import homeImage from "assets/homeImage.svg";

const Welcome = () => {
    return (
        <section className={styles.welcome}>
            <img src={homeImage} alt="welcome" loading="lazy" />
            <h2>Welcome to Chat-Nation</h2>
        </section>
    );
};

export default Welcome;
