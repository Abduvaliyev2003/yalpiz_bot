import { bot } from "../../core/bot";

bot.command("help", (ctx) => {
    const text = `Help commands: \n\n` + `/send - Nomzodga sms yozish \n\n` + `/find - Nomzodni qidirish \n\n` + `/dispatch - Hammaga xabar yuborish \n\n` + `————————————————`;

    ctx.reply(text);
});
