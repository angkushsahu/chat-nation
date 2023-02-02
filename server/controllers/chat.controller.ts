import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares";
import { cloudinaryConfig, ErrorHandler } from "../utils";
import { Chat, User } from "../models";
import * as types from "../types";

const populateUserInfo = "_id name userName pic email";

export const accessChat = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { userId }: types.IAccessChat = req.body;
    if (!userId) {
        return next(new ErrorHandler("Chat ID not found", 404));
    }

    // in the logic below, we are trying to access a chat which is not a group and consists of only the users with the user's own id and the id passed in req.body
    const chat = await Chat.find({
        isGroupChat: false,
        $and: [{ users: { $elemMatch: { $eq: res.typedLocals.user.id } } }, { users: { $elemMatch: { $eq: userId } } }],
    })
        .populate("users", populateUserInfo)
        .populate("latestMessage");

    const populatedChat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: populateUserInfo,
    });

    if (populatedChat.length) {
        return res.status(200).json({
            success: true,
            message: "Found chat successfully",
            chat: populatedChat[0],
        });
    }

    const newChatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [res.typedLocals.user._id, userId],
    };

    const newChat = await Chat.create(newChatData);
    const createdChat = await newChat.populate("users", populateUserInfo);

    res.status(201).json({
        success: true,
        message: "Created chat successfully",
        chat: createdChat,
    });
});

export const fetchAllUserChats = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    let queryField: types.IChatQuery = {
        users: { $elemMatch: { $eq: res.typedLocals.user.id } },
    };
    if (id === "all") {
    } else if (id === "group") {
        queryField = { ...queryField, isGroupChat: true };
    } else if (id === "individual") {
        queryField = { ...queryField, isGroupChat: false };
    } else {
        return next(new ErrorHandler("Please enter a valid query", 400));
    }

    const chats = await Chat.find(queryField)
        .populate("users", populateUserInfo)
        .populate("groupAdmin", populateUserInfo)
        .populate("latestMessage")
        .sort({ updatedAt: -1 });

    const populatedChats = await User.populate(chats, {
        path: "latestMessage.sender",
        select: populateUserInfo,
    });

    res.json({
        success: true,
        message: "Fetched all chats successfully",
        chats: populatedChats,
        numberOfChats: chats.length,
    });
});

export const createGroupChat = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { groupName, users }: types.ICreateGroupChat = req.body;
    if (!groupName || !users.length) {
        return next(new ErrorHandler("Please validate all the fields", 400));
    }

    if (users.length < 2) {
        return next(new ErrorHandler("At least two users are required for creating a group chat", 400));
    }

    // adding group creator to the users array as well (the group creator is also the admin)
    users.push(res.typedLocals.user.id);

    const chat = await Chat.create({
        chatName: groupName,
        users,
        isGroupChat: true,
        groupAdmin: res.typedLocals.user.id,
    });

    const groupChat = await (await chat.populate("users", populateUserInfo)).populate("groupAdmin", populateUserInfo);

    res.status(200).json({ success: true, message: "Created group successfully", chat: groupChat });
});

export const getGroupChat = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const chat = await Chat.findById(id);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 404));
    }

    const groupChat = await (await chat.populate("users", populateUserInfo)).populate("groupAdmin", populateUserInfo);

    res.status(200).json({ success: true, message: "Fetched group successfully", chat: groupChat });
});

export const addGroupLogo = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { image, chatId }: { image: string; chatId: string } = req.body;
    if (!image) {
        return next(new ErrorHandler("Please select an image", 400));
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 400));
    }
    if (chat.publicUrl) {
        await cloudinaryConfig.uploader.destroy(chat.publicUrl);
    }
    let pic: string = "";
    let publicUrl: string = "";
    const uploadImage = await cloudinaryConfig.uploader.upload(image, {
        folder: "chat-nation",
        use_filename: true,
    });
    pic = uploadImage.secure_url;
    publicUrl = uploadImage.public_id;

    chat.pic = pic;
    chat.publicUrl = publicUrl;
    await chat.save();
    const groupChat = await (await chat.populate("users", populateUserInfo)).populate("groupAdmin", populateUserInfo);

    res.status(200).json({ success: true, message: "Added logo successfully", chat: groupChat });
});

export const removeGroupLogo = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId }: { chatId: string } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat not found", 400));
    }
    if (!chat.publicUrl) {
        return next(new ErrorHandler("This group has no logo", 400));
    }
    await cloudinaryConfig.uploader.destroy(chat.publicUrl);
    chat.pic = "";
    chat.publicUrl = "";
    await chat.save();
    const groupChat = await (await chat.populate("users", populateUserInfo)).populate("groupAdmin", populateUserInfo);

    res.status(200).json({ success: true, message: "Created group successfully", chat: groupChat });
});

export const renameGroup = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, chatName }: types.IRenameGroup = req.body;
    if (!chatName) {
        return next(new ErrorHandler("Please choose a name for this group", 400));
    }

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", populateUserInfo)
        .populate("groupAdmin", populateUserInfo);

    if (!updatedChat) {
        return next(new ErrorHandler("Unable to rename group, please try again", 400));
    }

    res.status(200).json({ success: true, message: "Renamed chat successfully", updatedChat });
});

export const addToGroup = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, userId }: types.IAddToGroup = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat group not found", 404));
    }

    if (res.typedLocals.user.id !== chat.groupAdmin.toString()) {
        return next(new ErrorHandler("Only group admin can perform this action", 400));
    }

    if (chat.users.includes(userId)) {
        return next(new ErrorHandler("User is already a member of this group", 400));
    }

    chat.users.push(userId);
    await chat.save();

    const updatedChat = await (await chat.populate("users", populateUserInfo)).populate("groupAdmin", populateUserInfo);

    res.status(200).json({ success: true, message: "Updated chat successfully", updatedChat });
});

export const removeFromGroup = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId, userId }: types.IAddToGroup = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
        return next(new ErrorHandler("Chat group not found", 404));
    }

    if (res.typedLocals.user.id !== chat.groupAdmin.toString()) {
        return next(new ErrorHandler("Only group admin can perform this action", 400));
    }

    const updatedUsers = chat.users.filter((user) => String(user) !== String(userId));
    if (chat.users.length === updatedUsers.length) {
        return next(new ErrorHandler("User is not a part of this group", 400));
    }

    chat.users = updatedUsers;
    await chat.save();

    const updatedChat = await (await chat.populate("users", populateUserInfo)).populate("groupAdmin", populateUserInfo);

    res.status(200).json({ success: true, message: "Updated chat successfully", updatedChat });
});

export const deleteGroup = catchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    const { chatId } = req.body;
    const chatGroup = await Chat.findById(chatId);
    if (!chatGroup) {
        return next(new ErrorHandler("Chat group not found", 404));
    }

    if (res.typedLocals.user.id !== chatGroup.groupAdmin.toString()) {
        return next(new ErrorHandler("Only group admin can perform this action", 400));
    }

    await chatGroup.remove();

    res.status(200).json({
        success: true,
        message: "Chat group deleted successfully",
    });
});
