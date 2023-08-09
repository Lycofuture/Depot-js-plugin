/**
 * @Author: Lycofuture
 * @Date: 2023-07-20 14:51:32
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-09 19:12:33
 */
import fs from 'fs'
import yaml from 'yaml'
import Cfg from '../../lib/config/config.js'
const sycfg = './config/config/other.yaml'
const yamlContent = fs.readFileSync(sycfg, 'utf8')
let data = yaml.parse(yamlContent)
export class GroupNotificationswitch extends plugin {
    constructor() {
        super({
            name: '防撤回开关',
            dsc: '防撤回控制',
            event: `message`,
            priority: 1,
            rule: [{
                reg: '^#?防撤回(开启|关闭)$',
                fnc: 'switch'
            }]
        })
    }
    async switch(e) {
        const msg = e.msg
        if (e.member.is_admin || e.member.is_owner || Cfg.masterQQ.includes(Number(e.user_id))) {
            if (!data[e.group_id]) {
                data[e.group_id] = {}
            }
            if (/开启/.test(msg)) {
                data[e.group_id].withdraw = true
                await e.reply("防撤回已开启")
            } else if (/关闭/.test(msg)) {
                data[e.group_id].withdraw = false
                await e.reply("防撤回已关闭")
            }
            // 将JavaScript对象转换为YAML字符串
            const newYamlString = yaml.stringify(data)
            // 将新的YAML字符串写回到文件中
            fs.writeFileSync(sycfg, newYamlString, 'utf-8')
        } else {
            await e.reply('暂无权限，只有管理员才能操作')
        }
        return false
    }
}