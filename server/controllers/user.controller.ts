import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares";
import { cloudinaryConfig, ErrorHandler, validateEmail } from "../utils";
import { User } from "../models";
import * as types from "../types";

export const getAllUsers = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { search } = req.query;
    if (!search) {
        return next(new ErrorHandler("Please enter a search term", 400));
    }
    const keyword = search
        ? {
              $or: [
                  { name: { $regex: search, $options: "i" } },
                  { userName: { $regex: search, $options: "i" } },
                  { email: { $regex: search, $options: "i" } },
              ],
          }
        : {};

    const users = await User.find(keyword)
        .find({ _id: { $ne: res.typedLocals.user.id } })
        .select("name userName email pic _id");
    res.status(200).json({
        success: true,
        message: "Found all users successfully",
        users,
    });
});

export const getUser = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "User found successfully",
        user: res.typedLocals.user.getUser(),
    });
});

export const visitProfile = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User found successfully",
        user: user.getUser(),
    });
});

export const changePassword = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { password }: { password: string } = req.body;

    if (!password) {
        return next(new ErrorHandler("Please enter a password to reset", 400));
    }

    const user = res.typedLocals.user;
    user.password = password;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user: user.getUser(),
    });
});

export const userLogout = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("chatNationToken");
    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

export const deleteUserAccount = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const user = res.typedLocals.user;
    if (user.publicUrl) {
        await cloudinaryConfig.uploader.destroy(user.publicUrl);
    }
    res.clearCookie("chatNationToken");
    await user.delete();

    res.status(200).json({ success: true, message: "User account deleted successfully" });
});

export const updateUserDetails = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const { name, userName, email, pic }: types.IUpdateUser = req.body;
    const user = res.typedLocals.user;

    let condition = false;

    if (name && user.name !== name) {
        user.name = name;
        condition = true;
    }
    if (userName && user.userName !== userName) {
        user.userName = userName;
        condition = true;
    }
    if (email && user.email !== email) {
        if (!validateEmail(email)) {
            return next(new ErrorHandler("Invalid e-mail format", 400));
        }
        user.email = email;
        condition = true;
    }

    if (pic) {
        if (user.publicUrl) {
            await cloudinaryConfig.uploader.destroy(user.publicUrl);
        }
        const uploadImage = await cloudinaryConfig.uploader.upload(pic, {
            folder: "chat-nation",
            use_filename: true,
        });
        user.pic = uploadImage.secure_url;
        user.publicUrl = uploadImage.public_id;
        condition = true;
    }

    if (condition) {
        await user.save();
        return res.status(200).json({ success: true, user: user.getUser(), message: "Updated user details successfully" });
    }
    res.status(200).json({ success: true, message: "Nothing to update" });
});

export const removeAvatar = catchAsyncErrors(async function (req: Request, res: Response, next: NextFunction) {
    const user = res.typedLocals.user;
    if (!user.publicUrl) {
        return next(new ErrorHandler("User avatar not found", 404));
    }
    await cloudinaryConfig.uploader.destroy(user.publicUrl);
    user.pic = "";
    user.publicUrl = "";
    await user.save();
    return res.status(200).json({ success: true, user: user.getUser(), message: "Removed avatar successfully" });
});
