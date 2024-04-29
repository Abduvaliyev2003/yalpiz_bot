import { admins } from "../../const/admins";
import { bot } from "../../core/bot";

bot.command("send", (ctx) => {
    const user_id = ctx.from?.id as number;

    if (!admins.includes(user_id)) {
        return;
    }

    ctx.scenes.enter("send");
});
