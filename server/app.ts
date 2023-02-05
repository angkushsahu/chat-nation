import "./database";

import express from "express";
const app = express();

import { Locals } from "./express";
app.use(function (req, res, next) {
    res.typedLocals = res.locals as Locals;
    next();
});

const limit = "1000mb";
app.use(express.urlencoded({ extended: true, limit }));
app.use(express.json({ limit }));

import cors from "cors";
app.use(cors({ credentials: true, origin: true }));

import cookieParser from "cookie-parser";
app.use(cookieParser());

import { authRoutes, chatRoutes, messageRoutes, userRoutes } from "./routes";
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/chat", chatRoutes);

// production deployment
import { join } from "path";
if (process.env.NODE_ENV === "production") {
    app.use(express.static(join(__dirname, "../client", "build")));
    app.get("*", (req, res) => {
        res.sendFile(join(__dirname, "../client", "build", "index.html"));
    });
}

import { error } from "./middlewares";
app.use(error.invalidUrl);
app.use(error.errors);

const port = process.env.PORT || 8080;
const server = app.listen(port, () => console.log(`Listening on http://localhost:${port}/`));

export default server;
