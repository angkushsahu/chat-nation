import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { validateEmail } from "utils";
import backgroundImage from "assets/background.svg";
import { useForgotPasswordMutation } from "store/apiQueries";
import LoadingPage from "components/common/loading";

const ForgotPassword = () => {
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [email, setEmail] = useState("");

    const onForgotPassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.warn("Please enter your e-mail");
            return;
        }

        if (!validateEmail(email)) {
            toast.warn("E-mail format is not correct");
            return;
        }

        try {
            const response = await forgotPassword({ email }).unwrap();
            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    if (isLoading) {
        return <LoadingPage />;
    } else {
        return (
            <main className="form-container">
                <div className="image-container">
                    <img src={backgroundImage} alt="background" loading="lazy" />
                </div>
                <form onSubmit={onForgotPassword}>
                    <h1>Forgot Password</h1>
                    <div className="input-container">
                        <label htmlFor="email">Enter your e-mail</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="e.g. johndoe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button type="submit" disabled={isLoading}>
                        Send email
                    </button>
                </form>
            </main>
        );
    }
};

export default ForgotPassword;
