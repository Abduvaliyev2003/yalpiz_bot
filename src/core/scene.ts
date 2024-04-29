import { ScenesComposer } from "grammy-scenes";
import { BotContext } from "./bot";

import { sendScene } from "../scenes/send";
import { findScene } from "../scenes/find";
import { dispatchScene } from "../scenes/dispatch";
import { mainScene } from "../scenes/main";

export const scenes = new ScenesComposer<BotContext>();

scenes.scene(sendScene);
scenes.scene(findScene);
scenes.scene(dispatchScene);
scenes.scene(mainScene);
