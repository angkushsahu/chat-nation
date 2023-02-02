export interface IUser {
    name: string;
    pic: string;
    email: string;
    userName: string;
    _id: string;
    joinedOn: string;
}

export interface IMessage {
    messageBy: "me" | "them";
    text: string;
}

export type ChatType = "all" | "one-on-one" | "group";

export interface IChat<T = IUser> {
    _id: string;
    pic: string;
    chatName: string;
    isGroupChat: boolean;
    users: T[];
    createdAt: string;
    groupAdmin: undefined | IUser;
    latestMessage:
        | {
              _id: string;
              sender: IUser;
              chat: string;
              content: string;
              createdAt: string;
          }
        | undefined;
}

export interface IMsg {
    _id: string;
    sender: IUser;
    content: string;
    createdAt: string;
    updatedAt: string;
    chat: IChat;
}
