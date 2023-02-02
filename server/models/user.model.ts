import { Schema, model } from "mongoose";
import { compare, genSalt, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import crypto from "crypto";
import { IUser } from "../types";

const userSchema = new Schema(
    {
        name: { type: String, required: [true, "Please enter your name"] },
        userName: { type: String },
        email: { type: String, required: [true, "Please enter your e-mail"], unique: true },
        password: { type: String, required: [true, "Please enter a password"] },
        pic: { type: String, default: "" },
        publicUrl: { type: String, default: "" },
        resetPassword: { type: String, default: "" },
    },
    { timestamps: true }
);

// hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
});

// compare hashed password
userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await compare(enteredPassword, this.password);
};

// Creating JWT tokens
userSchema.methods.getJWTToken = function () {
    return sign({ id: this._id }, String(process.env.JWT_SECRET));
};

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(16).toString("hex");
    this.resetPassword = crypto.createHash("sha256").update(resetToken).digest("hex");

    return resetToken;
};

userSchema.methods.getUser = function () {
    return {
        name: this.name,
        userName: this.userName,
        email: this.email,
        pic: this.pic,
        _id: this._id,
    };
};

export default model<IUser>("User", userSchema);
