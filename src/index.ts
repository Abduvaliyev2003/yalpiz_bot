import "./core";
import "./actions";

import express, { Request, Response } from "express";
import { webhookCallback } from "grammy";
import { PORT, TYPE } from "./const";
import { bot } from "./core/bot";

const app = express();

if (TYPE === "production") {
    app.use(express.json());

    app.use("/hr-bot", webhookCallback(bot));

    app.get("/", (req: Request, res: Response) => {
        res.json({
            message: "Hello World!",
        });
    });

    app.listen(PORT, () => {
        console.log("Server running port on " + PORT);
    });
}

module.exports = app;
