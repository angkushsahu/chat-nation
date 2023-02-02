import { Schema, model } from "mongoose";
import { IMessage } from "../types";

const messageSchema = new Schema(
    {
        sender: { type: Schema.Types.ObjectId, ref: "User" },
        chat: { type: Schema.Types.ObjectId, ref: "Chat" },
        content: { type: String, trim: true },
    },
    { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);
