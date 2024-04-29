import { Scene } from "grammy-scenes";
import { BotContext } from "../../core/bot";
import { axiosApi } from "../../lib/axios";

export const findScene = new Scene<BotContext>("find");

findScene.use((_, next) => {
    return next();
});

findScene.label("start");

findScene.do(async (ctx) => {
    await ctx.reply("User tokenini kiriting:");
});

findScene.wait().on("message:text", async (ctx) => {
    let status: boolean = false;
    let user_id: number = 0;
    const token = ctx.message.text;

    await axiosApi.get(`user/get/${token}`).then(({ data }) => {
        if (!data.status) {
            status = true;
        } else user_id = data.user_id;
    });

    if (status) {
        ctx.reply("User topilmadi");
        ctx.scene.goto("start");
    } else {
        ctx.reply(`[User topildi: bosing](tg://user?id=${user_id})`, {
            parse_mode: "Markdown",
        });

        ctx.scene.exit();
    }
});
