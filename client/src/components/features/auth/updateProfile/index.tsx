import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { validateEmail } from "utils";
import backgroundImage from "assets/background.svg";
import { useRemoveAvatarMutation, useUpdateAccountMutation } from "store/apiQueries";
import { useAppSelector } from "store";
import { IUpdateAccount } from "types";
import LoadingPage from "components/common/loading";

const UpdateProfile = () => {
    const [updateAccount, { isLoading }] = useUpdateAccountMutation();
    const [removeAvatar, { isLoading: removeAvatarLoading }] = useRemoveAvatarMutation();
    const { user } = useAppSelector((state) => state.authSlice);
    const [inputValues, setInputValues] = useState({ pic: "", email: "", name: "", userName: "" });
    const picRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (user) {
            setInputValues({
                pic: "",
                email: user.email,
                name: user.name,
                userName: user.userName,
            });
        }
    }, [user]);

    const onProfileUpdate = async (e: FormEvent) => {
        e.preventDefault();
        const { email, name, pic, userName } = inputValues;

        if (!email || !name || !userName) {
            toast.warn("Please validate all the fields");
            return;
        }

        if (!validateEmail(email)) {
            toast.warn("E-mail format is not correct");
            return;
        }

        const updatedDetails: IUpdateAccount = {} as IUpdateAccount;
        updatedDetails.email = user?.email === email ? undefined : email;
        updatedDetails.name = user?.name === name ? undefined : name;
        updatedDetails.userName = user?.userName === userName ? undefined : userName;
        updatedDetails.pic = pic;

        try {
            if (updatedDetails.name || updatedDetails.email || updatedDetails.userName || updatedDetails.pic) {
                const data = await updateAccount(updatedDetails).unwrap();
                if (data.user) {
                    toast.success("Successfully updated your account");
                } else {
                    toast.error("Unable to update account, please try again later");
                }
            }
        } catch (err: any) {
            toast.error(err.data.message as string);
        }
    };

    const updatePic = (e: ChangeEvent<HTMLInputElement>) => {
        const image = e.target.files![0];
        if (!image) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = () => {
            setInputValues({ ...inputValues, pic: String(reader.result) });
        };
    };

    const removeAvatarFunction = async () => {
        if (user?.pic) {
            try {
                const response = await removeAvatar().unwrap();
                if (response.success) {
                    toast.success(response.message);
                }
            } catch (err: any) {
                toast.error(err.data.message as string);
            }
        }
    };

    const validateInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInputValues({ ...inputValues, [name]: value });
    };

    if (isLoading || removeAvatarLoading) {
        return <LoadingPage />;
    } else {
        return (
            <main className="form-container">
                <div className="image-container">
                    <img src={backgroundImage} alt="background" loading="lazy" />
                </div>
                <form onSubmit={onProfileUpdate}>
                    <h1>Update Profile</h1>
                    <label htmlFor="pic" className="avatar-image--container">
                        {inputValues.pic?.length || user?.pic ? (
                            <img
                                src={inputValues.pic ? inputValues.pic : user?.pic}
                                alt="avatar"
                                loading="lazy"
                                title="Change avatar"
                                className="avatar-image"
                            />
                        ) : (
                            <FaUserCircle title="Change avatar" className="avatar-image" />
                        )}
                    </label>
                    <div className="input-container">
                        <label htmlFor="name">Enter your name</label>
                        <input type="text" name="name" id="name" placeholder="e.g. John Doe" value={inputValues.name} onChange={validateInput} />
                    </div>
                    <div className="input-container">
                        <label htmlFor="name">Enter new user name</label>
                        <input
                            type="text"
                            name="userName"
                            id="userName"
                            placeholder="e.g. john_doe"
                            value={inputValues.userName}
                            onChange={validateInput}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="email">Enter your e-mail</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="e.g. johndoe@gmail.com"
                            value={inputValues.email}
                            onChange={validateInput}
                        />
                    </div>
                    <div className="input-container avatar-container" onClick={() => picRef.current?.click()}>
                        <label htmlFor="pic">Change avatar</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="pic"
                            id="pic"
                            placeholder="choose from your device"
                            onChange={updatePic}
                            ref={picRef}
                        />
                    </div>
                    <p
                        style={{ color: "lightgray", fontSize: "1.4rem", margin: "1rem 0 0 auto", width: "fit-content", cursor: "pointer" }}
                        onClick={removeAvatarFunction}
                    >
                        Remove Profile Picture
                    </p>
                    <button type="submit" disabled={isLoading}>
                        Update
                    </button>
                </form>
            </main>
        );
    }
};

export default UpdateProfile;
