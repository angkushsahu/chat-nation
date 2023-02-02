import { Schema, model } from "mongoose";
import { IChat } from "../types";

const chatSchema = new Schema(
    {
        chatName: { type: String, trim: true },
        isGroupChat: { type: Boolean, default: false },
        users: [{ type: Schema.Types.ObjectId, ref: "User" }],
        latestMessage: { type: Schema.Types.ObjectId, ref: "Message" },
        groupAdmin: { type: Schema.Types.ObjectId, ref: "User" },
        pic: { type: String, default: "" },
        publicUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

export default model<IChat>("Chat", chatSchema);
