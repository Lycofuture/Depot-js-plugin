/**
 * @Author: Lycofuture
 * @Date: 2023-06-27 00:02:37
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-30 18:25:45
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
import plugin from '../../lib/plugins/plugin.js'
import Cfg from '../../lib/config/config.js'
import YAML from 'yaml'
import fs from 'node:fs'
const file = './config/config/group.yaml'
const data = YAML.parse(fs.readFileSync(file, 'utf8'))
export class Commute extends plugin {
  constructor() {
    super({
      name: '上下班',
      dsc: '控制机器人上下班',
      event: 'message',
      priority: -10,
      rule: [
        {
          reg: `^下班$`,
          fnc: 'Down',
          permission: 'master'
        },
        {
          reg: `^上班$`,
          fnc: 'work',
          permission: 'master'
        },
        {
          reg: `^添加主人$`,
          fnc: 'dominate',
        },
        {
          reg: `^删除主人$`,
          fnc: 'subordinate',
        }
      ]
    })
  }
  async Down(e) {
    const commnot = new Commute()
    console.log(commnot)
    if (e.isGroup) {
      data[e.group_id] = {
        enable: commnot.name
      }
      const yaml = YAML.stringify(data)
      fs.writeFileSync(file, yaml, 'utf8')
      const response = await fetch('https://v1.hitokoto.cn')
      const yiyandata = await response.json()
      await e.reply([`派蒙走了哦，不要想我啦\n${yiyandata.hitokoto}`])
    } else {
      e.reply('请在群聊中使用')
    }
  }
  async work(e) {
    if (e.isGroup) {
      data[e.group_id] = {
        enable: null
      }
      const yaml = YAML.stringify(data)
      fs.writeFileSync(file, yaml, 'utf8')
      const response = await fetch('https://v1.hitokoto.cn')
      const yiyandata = await response.json()
      await e.reply([`派蒙回来了，嘿嘿\n${yiyandata.hitokoto}`])
    } else {
      e.reply('请在群聊中使用')
    }
  }
  async dominate(e) {
    if (Cfg.masterQQ[0] === e.user_id) {
      this.setContext('dominateadd')
      await e.reply('请发送要添加的主人账号', false, { at: true })
    } else {
      await e.reply(`你不是超级管理员\n当前账号超管: ${Cfg.masterQQ[0]}`)
    }
  }
  async subordinate(e) {
    if (Cfg.masterQQ[0] === e.user_id) {
      this.setContext('dominatedelete')
      await e.reply('请发送要删除的主人账号', false, { at: true })
    } else {
      await e.reply(`你不是超级管理员\n当前账号超管: ${Cfg.masterQQ[0]}`)
    }
  }
  dominateadd() {
    const file = './config/config/other.yaml'
    const data = YAML.parse(fs.readFileSync(file, 'utf8'))
    if (/^\d{5,12}$/.test(this.e.msg)) {
      data.masterQQ.push(Number(this.e.msg))
      const yaml = YAML.stringify(data)
      fs.writeFileSync(file, yaml, 'utf8')
      this.reply(`添加成功: ${this.e.msg}`)
    } else {
      this.reply(`添加错误: ${this.e.msg}`)
    }
    this.reply(`当前主人:\n${data.masterQQ.join('\n')}`)
    this.finish('dominateadd')
  }
  dominatedelete() {
    const file = './config/config/other.yaml'
    const data = YAML.parse(fs.readFileSync(file, 'utf8'))
    if (data.masterQQ.includes(Number(this.e.msg))) {
      data.masterQQ = data.masterQQ.filter((v) => v !== Number(this.e.msg))
      const yaml = YAML.stringify(data)
      fs.writeFileSync(file, yaml, 'utf8')
      this.reply(`删除成功: ${this.e.msg}`)
    } else {
      this.reply(`此账号不在主人列表里: ${this.e.msg}`)
    }
    this.reply(`当前主人:\n${data.masterQQ.join('\n')}`)
    this.finish('dominatedelete')
  }
} 
