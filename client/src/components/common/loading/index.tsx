import styles from "./styles.module.scss";
import LoadingComponent from "./loadingComponent";

const LoadingPage = () => {
    return (
        <section className={styles.loading}>
            <LoadingComponent />
        </section>
    );
};

export default LoadingPage;
