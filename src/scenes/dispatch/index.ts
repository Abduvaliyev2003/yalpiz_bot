import { Scene } from "grammy-scenes";
import { BotContext } from "../../core/bot";
import { axiosApi } from "../../lib/axios";

export const dispatchScene = new Scene<BotContext>("dispatch");

dispatchScene.use((_, next) => {
    return next();
});

dispatchScene.label("start");

dispatchScene.do(async (ctx) => {
    await ctx.reply("Teskt kiriting:");
});

dispatchScene.wait().on("message:text", async (ctx) => {
    const text = ctx.message.text.replace('>', '\>');
    ctx.session.text = text;

    await axiosApi.get("user/count").then(({ data }) => {
        if (data.error || !data.count) {
            ctx.reply("Userlar topilmadi!");
            ctx.scene.goto("start");
        }
    });

    await ctx.reply(text, {
        parse_mode: 'MarkdownV2'
    });

    ctx.scene.resume();
});

dispatchScene.do(async (ctx) => {
    await ctx.reply("Jo'natasizmi?", {
        parse_mode: "MarkdownV2",
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: `Jo'natish`,
                        callback_data: "d_sendMessage",
                    },
                    {
                        text: `Tekstni o'zgartirish`,
                        callback_data: "d_editMessage",
                    },
                ],
            ],
        },
    });
})

dispatchScene.wait().on("callback_query:data", async (ctx) => {
    await ctx.answerCallbackQuery();
    const text = ctx.session.text;
    const choice = ctx.callbackQuery.data;

    await ctx.reply('Ok');

    if (choice === "d_sendMessage") {
        let users: {user_id: string|number}[];

        await axiosApi.get("user/all").then(({ data }) => {
            if (!data.users) {
                ctx.scene.goto('start')
                return;
            }

            users = data.users as { user_id: string|number }[];
        });

        await ctx.reply(`Jo'natilmoqda!`);

        // @ts-ignore
        users.map(async (user) => {
            await ctx.api.sendMessage(user.user_id, text, { parse_mode: "Markdown" });
        });

        await ctx.reply(`Jo'natildi!`)
        ctx.scene.exit();
    } else if (choice === "d_editMessage") {
        ctx.scene.goto("start");
    } else ctx.scene.exit();
});
