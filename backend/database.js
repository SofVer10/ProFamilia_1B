
import mongoose from "mongoose";

import {config} from "./src/confing.js"

mongoose.connect(config.db.URI)

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("DB is connected");
});

connection.on("disconnected", () => {
    console.log("DB is disconnected");
});

connection.once("error", (error) => {
    console.log("Error found" + error);
});
