import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import { catchAsyncErrors } from "../middlewares";
import { cloudinaryConfig, ErrorHandler, sendEmail, sendToken, validateEmail } from "../utils";
import { User } from "../models";
import * as types from "../types";

export const userRegister = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const { name, userName, email, password, pic }: types.ISignup = req.body;

    if (!name || !userName || !email || !password) {
        return next(new ErrorHandler("Please validate all the fields", 400));
    }

    if (!validateEmail(email)) {
        return next(new ErrorHandler("Invalid e-mail format", 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorHandler("E-mail already registered", 400));
    }

    let image: string = "";
    let publicUrl: string = "";
    if (pic) {
        const uploadImage = await cloudinaryConfig.uploader.upload(pic, {
            folder: "chat-nation",
            use_filename: true,
        });
        image = uploadImage.secure_url;
        publicUrl = uploadImage.public_id;
    }

    const user = await User.create({ name, userName, email, password, pic: image, publicUrl });
    if (!user) {
        return next(new ErrorHandler("Unable to create user account, internal server error", 500));
    }

    sendToken(res, user, 201, "User account created successfully");
});

export const userLogin = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const { email, password }: types.ILogin = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please validate all the fields", 400));
    }

    if (!validateEmail(email)) {
        return next(new ErrorHandler("Invalid e-mail format", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found, register instead", 404));
    }

    const arePasswordsSame = await user.comparePassword(password);
    if (!arePasswordsSame) {
        return next(new ErrorHandler("Invalid credentials", 400));
    }

    sendToken(res, user, 200, "User login successful");
});

export const forgotPassword = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const { email }: types.IForgotPassword = req.body;

    if (!email) {
        return next(new ErrorHandler("Please provide an email", 404));
    }

    if (!validateEmail(email)) {
        return next(new ErrorHandler("Invalid e-mail format", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("User not found, make sure you already have an account", 404));
    }

    const resetToken: string = user.getResetPasswordToken();
    const { success, message } = await sendEmail(email, resetToken); // sending mail to the client
    if (!success) {
        return next(new ErrorHandler(message, 500));
    }
    await user.save();

    res.status(200).json({
        success: true,
        message: `Password reset link has been sent to ${email}, please check your e-mail`,
    });
});

export const resetPassword = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const { password }: types.IResetPassword = req.body;
    const { id } = req.params;
    const resetId = crypto.createHash("sha256").update(id).digest("hex");
    const user = await User.findOne({ resetPassword: resetId });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user.password = password;
    user.resetPassword = "";
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully, login to your account with new password",
    });
});
