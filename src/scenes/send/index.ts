import { Scene } from "grammy-scenes";
import { BotContext } from "../../core/bot";
import { axiosApi } from "../../lib/axios";

export const sendScene = new Scene<BotContext>("send");

sendScene.use((_, next) => {
    return next();
});

sendScene.label("start");

sendScene.do(async (ctx) => {
    await ctx.reply("User tokenini kiriting:");
    // await ctx.reply('User tokenini kiriting:', {
    //     reply_markup: {
    //         keyboard: [
    //             [
    //                 'Orqaga'
    //             ],
    //         ],
    //         resize_keyboard: true
    //     },
    // });
});

sendScene.wait().on("message:text", async (ctx) => {
    let status: boolean = false;
    const token = ctx.message.text;

    try {
        await axiosApi.get(`user/get/${token}`).then(({ data }) => {
            if (!data.status) {
                status = true;
            }
        });

        if (status) {
            await ctx.reply("User topilmadi");
            ctx.scene.goto("start");
        } else {
            ctx.session.token = token;
            ctx.scene.resume();
        }
    } catch (e) {
        await ctx.reply("User topilmadi");
        ctx.scene.goto("start");
    }

});

sendScene.label("editMessage");

sendScene.do(async (ctx) => {
    await ctx.reply(`Jo'natmoqchi bolgan so'zingizni kiriting:`);
});

sendScene.wait().on("message:text", async (ctx) => {
    await ctx.reply(ctx.message.text, { parse_mode: "Markdown" });
    ctx.session.text = ctx.message.text;
    ctx.scene.resume();
});

sendScene.do(async (ctx) => {
    ctx.reply(`Jo'natasizmi?`, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Jo'natish`,
                        callback_data: "sendMessage",
                    },
                    {
                        text: `Tekstni o'zgartirish`,
                        callback_data: "editMessage",
                    },
                ],
            ],
        },
    });
});

sendScene.wait().on("callback_query:data", async (ctx) => {
    await ctx.answerCallbackQuery();
    const token = ctx.session.token;
    const text = ctx.session.text;
    const choice = ctx.callbackQuery.data;

    if (choice === "sendMessage") {
        let chat_id: number = 0;

        await axiosApi.get(`user/get/${token}`).then(({ data }) => {
            chat_id = data.user_id;
        });

        await ctx.api.sendMessage(chat_id, text, { parse_mode: "MarkdownV2" });
        await ctx.reply(`Jo'natildi`);
        ctx.scene.exit();
    } else if (choice === "editMessage") {
        //
        ctx.scene.goto("editMessage");
        //
    } else ctx.scene.exit();
});
