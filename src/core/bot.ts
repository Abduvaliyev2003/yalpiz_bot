import { scenes } from "./scene";
import { Bot, Context, session, SessionFlavor } from "grammy";
import { ScenesSessionFlavor, ScenesFlavor } from "grammy-scenes";
import { API_TOKEN, TYPE } from "../const";

type SessionData = {
    name: string;
    token: string;
    text: string;
} & ScenesSessionFlavor;

export type BotContext = Context & SessionFlavor<SessionData> & ScenesFlavor;

export const bot = new Bot<BotContext>(API_TOKEN, {
    client: {
        canUseWebhookReply: (method) => method === "sendChatAction",
    },
});

bot.use(
    session({
        initial: () => ({ name: "David", token: "", text: "" }),
    })
);

bot.use(scenes.manager());

bot.use(scenes);

bot.catch(async error => {
    console.log(error.message)

    try {
        const message = `Error: ${error.name} \n\n` + `${error.message}`
        await error.ctx.api.sendMessage(316340903, message)
    } catch (err) {}
})

if (TYPE === "production") {
    bot.start();
}
