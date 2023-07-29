/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:57:32
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:26:22
 * 使用方法：
 * #查权重+QQ号，带不带#都行在群聊里可以@别人也可以直接发#查权重查自己的
 * 换了个接口，上一个接口寄了
 * 感谢椰羊佬帮我改进
 * 1.定义命令规则
 * 2.QQ权重api失效，暂时更换为QQ凶吉
 */
if (!global.segment) {
    try {
        global.segment = (await import('icqq')).segment
    } catch {
        try {
            global.segment = (await import('oicq')).segment
        } catch { }
    }
}
import fetch from "node-fetch";
import lodash from 'lodash'
import plugin from '../../lib/plugins/plugin.js'
export class QQWeights extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: '查QQ凶吉',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 1,
            rule: [{
                /** 命令正则匹配 */
                reg: "^#*查(.*)$",
                /** 执行方法 */
                fnc: 'chaquanzhong'
            },]
        })
    }
    //执行方法
    async chaquanzhong(e) {
        let qq = e.message.filter(item => item.type == 'at')?.map(item => item?.qq);
        console.log(qq);
        try {
            if (lodash.isEmpty(qq)) {
                qq = e.msg.match(/\d+/g)
            }
            if (!qq) qq = [e.user_id]
            for (let i of qq) {
                //QQ权重api失效
                //let url = `http://tc.tfkapi.top/API/qqqz.php?type=json&qq=${i}`;
                let url = `https://api.pearktrue.cn/api/xj/qq.php?qq=${i}`
                let response = await fetch(url);
                let res = await response.json();
                if (res.code === 200) {
                    let msg = [
                        `QQ：${res.data.qq}\n`,
                        `评分：${res.data.wxsl}\n`,
                        `属性：${res.data.wxsx}\n`,
                        `状态：${res.data.wxyy}\n`,
                        `凶吉：${res.data.xjfx}\n`,
                        `评价：${res.data.zrgx}\n`
                    ];
                    //发出消息
                    await e.reply(msg);
                } else {
                    e.reply("查询失败")
                }
            }
        } catch (error) {
            e.reply(error)
        }
        return true; //返回true 阻挡消息不再往下
    }

}
