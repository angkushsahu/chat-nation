import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { BiShow, BiHide } from "react-icons/bi";
import backgroundImage from "assets/background.svg";
import { useChangePasswordMutation } from "store/apiQueries";
import LoadingPage from "components/common/loading";

const ChangePassword = () => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [inputValues, setInputValues] = useState({ password: "", confirmPassword: "" });

    const onChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        if (!inputValues.password || !inputValues.confirmPassword) {
            toast.warn("Please validate all the fields");
            return;
        }

        if (inputValues.confirmPassword !== inputValues.password) {
            toast.warn("Password fields are not matching");
            return;
        }

        try {
            const response = await changePassword({ password: inputValues.password }).unwrap();
            if (response.success) {
                toast.success("Password updated successfully");
                setInputValues({ confirmPassword: "", password: "" });
            } else {
                toast.error(response.message);
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    const validateInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    const showPasswordFunctionality = () => setShowPassword(true);
    const hidePasswordFunctionality = () => setShowPassword(false);
    const showConfirmPasswordFunctionality = () => setShowConfirmPassword(true);
    const hideConfirmPasswordFunctionality = () => setShowConfirmPassword(false);

    if (isLoading) {
        return <LoadingPage />;
    } else {
        return (
            <main className="form-container">
                <div className="image-container">
                    <img src={backgroundImage} alt="background" loading="lazy" />
                </div>
                <form onSubmit={onChangePassword}>
                    <h1>Change Password</h1>
                    <div className="input-container">
                        <label htmlFor="password">Enter new password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            placeholder="Enter a strong password"
                            value={inputValues.password}
                            onChange={validateInput}
                        />
                        {showPassword ? <BiHide onClick={hidePasswordFunctionality} /> : <BiShow onClick={showPasswordFunctionality} />}
                    </div>
                    <div className="input-container">
                        <label htmlFor="confirmPassword">Re-enter new password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Re-enter your password"
                            value={inputValues.confirmPassword}
                            onChange={validateInput}
                        />
                        {showConfirmPassword ? (
                            <BiHide onClick={hideConfirmPasswordFunctionality} />
                        ) : (
                            <BiShow onClick={showConfirmPasswordFunctionality} />
                        )}
                    </div>
                    <button type="submit" disabled={isLoading}>
                        Change Password
                    </button>
                </form>
            </main>
        );
    }
};

export default ChangePassword;
