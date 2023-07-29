/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:59:10
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:43:04
 */
import plugin from "../../lib/plugins/plugin.js";
import lodash from "lodash";

// @机器人后自定义回复，随机取
const replies = [
    "@本大人干啥玩意",
    "啥事？",
    "666"
];
export class Replyat extends plugin {
    constructor() {
        super({
            name: "@机器人回复",
            dsc: "回复",
            event: "message.group",
            priority: 1000,
        });
    }

    async accept() {
        // 判断只有@没有其他内容
        const isEmptyMessage =
            this.e.message.length == 1 ||
            (this.e.message.length == 2 && this.e.message[1].text == "");

        if (this.e.atme && isEmptyMessage) {
            await this.e.reply(lodash.sample(replies));
            return "return";
        }
        return false;
    }
}