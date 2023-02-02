import { NextFunction, Request, Response } from "express";
import { catchAsyncErrors } from "../middlewares";
import { ErrorHandler } from "../utils";
import { Chat, Message, User } from "../models";
import { IReceivedMessage } from "../types";

export const addMessage = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const { chatId, content }: IReceivedMessage = req.body;
        if (!content.trim() || !chatId) {
            return next(new ErrorHandler("Invalid request", 400));
        }

        const newMessage = {
            sender: res.typedLocals.user.id,
            content,
            chat: chatId,
        };

        const message = await Message.create(newMessage);
        if (!message) {
            return next(new ErrorHandler("Unable to send message", 400));
        }

        const populateSenderAndChat = await (
            await message.populate("sender", "name userName pic")
        ).populate("chat");
        const populatedMessage = await User.populate(populateSenderAndChat, {
            path: "chat.users",
            select: "name userName pic",
        });

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: populatedMessage,
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            msg: populatedMessage,
        });
    }
);

export const fetchAllMessages = catchAsyncErrors(
    async (req: Request, res: Response, next: NextFunction) => {
        const chatId = req.params.id;
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "name pic userName")
            .populate("chat");

        res.status(200).json({
            success: true,
            message: "Fetched all messages successfully",
            msgs: messages,
        });
    }
);
