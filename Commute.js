/**
 * @Author: Lycofuture
 * @Date: 2023-06-27 00:02:37
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:21:47
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
import YAML from 'yaml'
import fs from 'node:fs'
let file = './config/config/group.yaml'
let data = YAML.parse(fs.readFileSync(file, 'utf8'))
let cmsg
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
        }
      ]
    })
  }
  async Down(e) {
    if (e.isGroup) {
      data[e.group_id] = {
        enable: Commute.name
      }
      let yaml = YAML.stringify(data)
      fs.writeFileSync(file, yaml, 'utf8')
      console.log(data)
      const response = await fetch('https://v1.hitokoto.cn')
      const yiyandata = await response.json()
      const yiyan = yiyandata.hitokoto
        .split('，')
        .slice(0, 2)
        .map(sentence => sentence.trim())
        .join('，')
      await e.reply([`派蒙走了哦，不要想我啦\n${yiyandata.hitokoto}`])
      let ccs = {
        app: 'com.tencent.miniapp',
        desc: '',
        bizsrc: '',
        view: 'all',
        ver: '1.0.0.89',
        prompt: '终于下班了',
        appID: '',
        sourceName: '',
        actionData: '',
        actionData_A: '',
        sourceUrl: '',
        meta: {
          all: {
            buttons: [
              {
                action: 'http://qq.com',
                name: '派蒙走了哦，不要想我啦'
              }
            ],
            jumpUrl: 'https://www.bing.com/th?id=OHR.VillandryGarden_ZH-CN6140359139_1920x1080.jpg',
            preview: 'http://gchat.qpic.cn/gchatpic_new/0/0-0-95821F3DED8669D9D3AEE862234D4C2E/0',
            summary: '',
            title: yiyan
          }
        },
        config: {
          ctime: 1687741340,
          forward: true,
          token: '872f4e7f659deaa4c2fb9fb3d56e5071'
        },
        text: '',
        sourceAd: '',
        extra: ''
      }
      // eslint-disable-next-line no-undef
      // await e.reply(segment.json(JSON.stringify(ccs)))
    } else {
      e.reply('请在群聊中使用')
    }
  }
  async work(e) {
    if (e.isGroup) {
      data[e.group_id] = {
        enable: null
      }
      let yaml = YAML.stringify(data)
      fs.writeFileSync(file, yaml, 'utf8')
      console.log(data)
      const response = await fetch('https://v1.hitokoto.cn')
      const yiyandata = await response.json()
      const yiyan = yiyandata.hitokoto
        .split('，')
        .slice(0, 2)
        .map(sentence => sentence.trim())
        .join('，')
      await e.reply([`派蒙回来了，嘿嘿\n${yiyandata.hitokoto}`])
      let ccs = {
        app: 'com.tencent.miniapp',
        desc: '',
        bizsrc: '',
        view: 'all',
        ver: '1.0.0.89',
        prompt: '好生气哦，哼~',
        appID: '',
        sourceName: '',
        actionData: '',
        actionData_A: '',
        sourceUrl: '',
        meta: {
          all: {
            buttons: [
              {
                action: 'http://qq.com',
                name: '派蒙回来了，嘿嘿'
              }
            ],
            jumpUrl: 'https://www.bing.com/th?id=OHR.VillandryGarden_ZH-CN6140359139_1920x1080.jpg',
            preview: 'http://gchat.qpic.cn/gchatpic_new/0/0-0-95821F3DED8669D9D3AEE862234D4C2E/0',
            summary: '',
            title: yiyan
          }
        },
        config: {
          ctime: 1687741340,
          forward: true,
          token: '872f4e7f659deaa4c2fb9fb3d56e5071'
        },
        text: '',
        sourceAd: '',
        extra: ''
      }
      // eslint-disable-next-line no-undef
      // await e.reply(segment.json(JSON.stringify(ccs)))
    } else {
      e.reply('请在群聊中使用')
    }
  }
}
