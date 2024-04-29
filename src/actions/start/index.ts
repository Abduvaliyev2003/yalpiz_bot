import { bot } from "../../core/bot";
import { axiosApi } from "../../lib/axios";
import { log } from "util";
import { GROUP_ID } from "../../const";

bot.command("start", async (ctx) => {
    let message: string = "Assalomu alaykum.";
    const user_id = ctx.from?.id;
    const firstName = ctx.from?.first_name;
    const username = ctx.from?.username;
    const token = ctx.message?.text.split(" ")[1];

    if (token?.length) {
        let answers: any = "";
        let messageId: number = 0;
        await axiosApi.post("user/store", { user_id, token }).then((data) => {
            console.log(data, ' => user store ');
        }).catch((e) => console.log(e, ' => user store catch'));

        message = `Assalomu alaykum. Sizning arizangiz qabul qilindi. Siz bilan o'zimiz aloqaga chiqamiz`;

        await axiosApi.get(`data/${token}`, ).then(({ data }) => {
            console.log(data, '  => data/token ');
            if (data.status) {
                answers = data.data;
                messageId = data.message_id;
            }
        });

        const url = username?.length ? `https://t.me/${username}` : `tg://user?id=${user_id}`;
        answers = arrayToObject(answers);
        Object.assign(answers, { username: `<a href="${url}">${firstName}</a>` });
        answers = convertObjectToMessage(answers);

        ctx.api.editMessageText(GROUP_ID, messageId, answers, { parse_mode: "HTML" });
    }

    ctx.reply(message);
    // await ctx.scenes.enter("main");
});

export function arrayToObject(array: any[]): object | any {
    const object: object | any = {};

    array.map((data) => {
        object[data.name] = data.value;
    });

    return object;
}

const convertObjectToMessage = (object: object): string => {
    let message: string = "";
    Object.entries(object).forEach(([key, value]) => {
        message += `<b>${converters[key]}</b> ${value} \n\n`;
    });

    return message;
};

const converters: any = {
    id: "Token:",
    ism: "Ism-sharifingiz:",
    tugilgan_sana: "Tug'ilgan sanangiz:",
    yashash_manzil: "Hozirgi yashash manzilingiz:",
    soha: "Qaysi soha bo'yicha ishga joylashmoqchisiz?",
    oxirgi_ish_sabab: "Oxirgi ish joyingizdan bo'shashingizga nima sabab bo'lgan?",
    maosh_xoxish: "Qancha maosh xohlaysiz?",
    motivatsiya: "Nimalardan ruhlanasiz?",
    salomlashish: "Begona odam bilan qanday salomlashasiz?",
    aynan_siz_sabab: "Nega aynan sizni ishga olishimiz kerak deb hisoblaysiz?",
    komp_dasturlar:
        "Kompyuter dasturlaridan qaysilarini bilasiz? (word, excel, trello va h.k. lar)",
    ctrl_x_nima: "Ctrl+X qanday vazifani bajaradi?",
    ishlashdan_maqsad: "Ishlashdan maqsad nima deb o'ylaysiz?",
    chet_tillari: "Qaysi chet tillarini bilasiz?",
    instagram_user: "Instagram username'ingiz:",
    telefon_raqam: "Telefon raqamingiz:",
    oxirgi_ish_joy: "Oxirgi ish joyingiz?",
    username: "Profil:",
};
