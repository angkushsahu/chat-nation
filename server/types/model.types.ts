import { Document, Schema } from "mongoose";

export interface ITimeStamps {
    createdAt: Date;
    updatedAt: Date;
}

export interface IReturnUser {
    name: string;
    userName: string;
    email: string;
    pic: string;
}

export interface IUser extends Document, IReturnUser, ITimeStamps {
    password: string;
    publicUrl: string;
    resetPassword: string;
    getUser(): IReturnUser;
    comparePassword(enteredPassword: string): Promise<boolean>;
    getJWTToken(): string;
    getResetPasswordToken(): string;
}

export interface IMessage extends Document, ITimeStamps {
    sender: Schema.Types.ObjectId;
    chat: Schema.Types.ObjectId;
    content: string;
}

export interface IChat extends Document, ITimeStamps {
    chatName: string;
    isGroupChat: boolean;
    users: Schema.Types.ObjectId[];
    latestMessage: Schema.Types.ObjectId;
    groupAdmin: Schema.Types.ObjectId;
    pic: string;
    publicUrl: string;
}

export interface IDecodedToken {
    id: string;
    iat: number;
    exp: number;
}
