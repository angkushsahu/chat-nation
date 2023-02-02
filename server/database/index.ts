import { connect, set } from "mongoose";

const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1:27017/chat-nation";

set("strictQuery", false);

connect(dbUrl)
    .then(() => console.log("Database connected"))
    .catch((error) => console.log(error));
