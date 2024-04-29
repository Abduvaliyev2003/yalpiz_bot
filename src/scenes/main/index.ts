import { Scene } from "grammy-scenes";
import { BotContext } from "../../core/bot";
import { axiosApi } from "../../lib/axios";
// import { arrayToObject } from "../../actions/start";

export const mainScene = new Scene<BotContext>("main");

mainScene.use((_, next) => {
    return next();
});
mainScene.label('start');
mainScene.do(async (ctx) => {
    let message: string = "Assalomu alaykum.";
    const user_id = ctx.from?.id;
    const firstName = ctx.from?.first_name;
    const username = ctx.from?.username;
    // @ts-ignore
    const token = ctx.message?.text.split(" ")[1];

    if (token?.length) {
        let answers: any = "";
        let messageId: number = 0;
        await axiosApi.post("user", { user_id, token }).then();

        message = `Assalomu alaykum. Sizning arizangiz qabul qilindi. Siz bilan o'zimiz aloqaga chiqamiz`;

        await axiosApi.post("getdata", { token }).then(({ data }) => {
            if (!data.error) {
                answers = data.data;
                messageId = data.message_id;
            }
        });

        const url = username?.length ? `https://t.me/${username}` : `tg://user?id=${user_id}`;
        answers = arrayToObject(answers);
        Object.assign(answers, { username: `<a href="${url}">${firstName}</a>` });
        answers = convertObjectToMessage(answers);

        ctx.api.editMessageText("-1001753280173", messageId, answers, { parse_mode: "HTML" });
    }

    await ctx.reply(message);
})

mainScene.wait().on("message:text", (ctx) => {
    if (ctx.session.text === 'Orqaga') {
        mainScene.goto('start');
    }
})

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
    vakansiya: "Qaysi vakansiga bo`yicha?",
    ism: "Ism-sharifingiz:",
    tugilgan_sana: "Tug'ilgan sanangiz:",
    yashash_manzil: "Hozirgi yashash manzilingiz:",
    soha: "Qaysi soha bo'yicha ishga joylashmoqchisiz?",
    oxirgi_ish_sabab: "Oxirgi ish joyingizdan bo'shashingizga nima sabab bo'lgan?",
    maosh_xoxish: "Qancha maosh xohlaysiz?",
    aynan_siz_sabab: "Nega aynan sizni ishga olishimiz kerak deb hisoblaysiz?",
    hozir_qayer_ishlayapiz: "Hozir qayerda ishlayapiz/ o‘qiyapsiz?",
    restaran_sohasida_tajriba: "Restaran sohasida tajribangiz?",
    telefon_raqam: "Telefon raqamingiz:",
    oxirgi_ish_joy: "Oxirgi ish joyingiz?",
    username: "Profil:",
    portfolio_link: "Portfolio lnk"
};
