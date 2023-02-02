import { IUser } from "./primary";

export interface ILogin {
    email: string;
    password: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IResetPassword {
    password: string;
    resetId: string;
}

export interface ISignup {
    name: string;
    userName: string;
    password: string;
    pic?: string;
    email: string;
}

export interface IChangePassword {
    password: string;
}

export interface IRequest {
    success: boolean;
    message: string;
}

export interface IUpdateAccount {
    name?: string;
    userName?: string;
    pic?: string;
    email?: string;
}

export interface ICreateGroup {
    groupName: string;
    users: string[];
}

export interface IRenameGroup {
    chatId: string;
    chatName: string;
}

export interface IAddLogo {
    chatId: string;
    image: string;
}

export interface IUpdateUsersInGroup {
    chatId: string;
    userId: string;
}

export interface IAddMessge {
    chatId: string;
    content: string;
}
