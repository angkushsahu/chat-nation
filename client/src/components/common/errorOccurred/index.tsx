import styles from "./styles.module.scss";
import { useNavigate } from "react-router-dom";

const SomeErrorOccurred = () => {
    const navigate = useNavigate();

    setTimeout(() => {
        navigate(-2);
    }, 3000);

    return (
        <section className={styles.some_error}>
            <h1>Some Error Occurred</h1>
            <h2>Pleae visit this page again later</h2>
        </section>
    );
};

export default SomeErrorOccurred;
