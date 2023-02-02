import { Schema } from "mongoose";

export interface ISignup {
    name: string;
    userName?: string;
    pic?: string;
    email: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IResetPassword {
    password: string;
}

export interface IUpdateUser {
    name: string;
    userName: string;
    email: string;
    pic: string;
    deleteAvatar: boolean;
}

export interface ICreateGroupChat {
    groupName: string;
    users: Schema.Types.ObjectId[];
}

export interface IRenameGroup {
    chatId: Schema.Types.ObjectId;
    chatName: string;
}

export interface IAddToGroup {
    chatId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

export interface IReceivedMessage {
    content: string;
    chatId: Schema.Types.ObjectId;
}

export interface IAccessChat {
    userId: Schema.Types.ObjectId;
}

export interface IChatQuery {
    users: {
        $elemMatch: {
            $eq: Schema.Types.ObjectId | string;
        };
    };
    isGroupChat?: boolean;
}
