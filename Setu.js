/**
 * @Author: xwy231321
 * @Date: 2023-05-02 17:08:56
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-01 17:32:39
 */
let msgsscr = true //消息转发信息是否为bot,false为是，true为否
let r18 = 0 //0为关闭r18，1为开启r18，2为混合模式
let selilo = 10 //默认数量
let shu = 50 //最大数量

if (!global.segment) {
  try {
    global.segment = (await import('icqq')).segment
  } catch {
    try {
      global.segment = (await import('oicq')).segment
    } catch {
    }
  }
}
const url = [] // 链接储存
import fetch from 'node-fetch'
import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import fs from 'fs'
import YAML from 'yaml'
const sycfg = './config/config/other.yaml'
const YAMLContent = fs.readFileSync(sycfg, 'utf8')
const data = YAML.parse(YAMLContent)
export class Setu extends plugin {
  constructor() {
    super({
      name: 'loli',
      dsc: 'st',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: '^#?(涩|色|濏|瑟|铯)(铯|濏|涩|色|瑟|图)(开启|关闭)$',
          fnc: 'switch'
        },
        {
          reg: '^#?(涩|色|濏|瑟|铯)(铯|濏|涩|色|瑟|图)(prod|plus)?(.*)$',
          fnc: 'sese'
        },
      ]
    })
  }

  async init() {
    const listdata = []
    if (!data.setu) {
      // 添加开关参数
      data.setu = true
      // 将JavaScript对象转换为YAML字符串
      const newYAMLString = YAML.stringify(data)
      // 将新的YAML字符串写回到文件中
      fs.writeFileSync(sycfg, newYAMLString, 'utf-8')
    }
    for (let i = 0; i < 9; i++) {
      const recursive = await fetch(`https://api.moegoat.com/api/user/library/tag/id?tag_id=41&sort=choicest&page=${i}`)
      const data = await recursive.json()
      listdata.push(data)
    }
    for (let list of listdata) {
      for (let id of list.data) {
        const recursive = await fetch(`https://api.moegoat.com/api/lois/${id.id}`)
        const datajson = await recursive.json()
        for (let image of datajson.data.images) {
          url.push(image)
        }
      }
    }
  }
  async switch(e) {
    if (e.member.is_admin || e.member.is_owner || Cfg.masterQQ.includes(Number(e.user_id))) {
      if (!data[e.group_id]) {
        data[e.group_id] = {}
      }
      if (/开启/.test(e.msg)) {
        data[e.group_id].setu = true
        await e.reply("色图功能已开启")
      } else if (/关闭/.test(e.msg)) {
        data[e.group_id].setu = false
        await e.reply("色图功能已关闭")
      }
      // 将JavaScript对象转换为YAML字符串
      const newYAMLString = YAML.stringify(data)
      // 将新的YAML字符串写回到文件中
      fs.writeFileSync(sycfg, newYAMLString, 'utf-8')
    } else {
      await e.reply('暂无权限，只有管理员才能操作')
    }
  }
  async sese(e) {
    let ForwardMsg, makeMsg, dec, data = []
    if (data[e.group_id]?.setu) {
      if (e.msg.includes('pro')) {
        let num = e.msg.match(/\d+/) || selilo
        let msgList = []
        if (num > shu) {
          num = shu
          await e.reply(`一次最多${shu}张哦`)
          return false
        }
        await e.reply([segment.at(e.user_id), `正在给你找pro图片啦～\n 数量${num}张获取中～`], false, {
          recallMsg: 0
        })
        for (let i = 0; i < [num]; i++) {
          let url = Math.floor(Math.random() * 3) + 1
          if (url === 1) {
            url = `https://image.anosu.top/pixiv/direct?r18=1`
          } else if (url === 2) {
            url = `https://image.anosu.top/pixiv/direct?r18=1&keyword=genshinimpact`
          } else {
            url = `https://moe.jitsu.top/api/?sort=r18&size=small&type=302`
          }
          let seseshu = `已获取图片第${i + 1}张`
          logger.info(`${url}:\n${seseshu}`)
          msgList.push([segment.image(url), seseshu])
          await common.sleep(1000)
        }
        dec = `${e.sender.card || e.sender.nickname}(${e.user_id
          })lolicon的pro版，已经帮你整理好了请查收...`
        ForwardMsg = await common.makeForwardMsg(e, msgList, dec, msgsscr)
        makeMsg = await e.reply(ForwardMsg)
      } else if (e.msg.includes('plus')) {
        let num = e.msg.match(/\d+/) || selilo
        if (num > shu) {
          num = shu
          await e.reply(`一次最多${shu}张哦`)
          return false
        }
        await e.reply([segment.at(e.user_id), `正在给你找plus图片啦～\n 数量${num}张获取中～`], false, {
          recallMsg: 0
        })
        for (let i = 0; i < [num]; i++) {
          data.push(segment.image(url[Math.floor(Math.random() * url.length)]))
        }
        dec = `${e.sender.card || e.sender.nickname}(${e.user_id
          })lolicon的plus版,已经帮你整理好了请查收...`
        ForwardMsg = await common.makeForwardMsg(e, data, dec, msgsscr)
        makeMsg = await e.reply(ForwardMsg, false, { recallMsg: 60 })
      } else {
        let num = e.msg.match(/\d+/) || selilo
        if (num > shu) {
          num = shu
          await e.reply(`一次最多${shu}张哦`)
          return false
        }
        await e.reply([segment.at(e.user_id), `正在给你找图片啦～\n 数量${num}张获取中～`], false, {
          recallMsg: 0
        })
        for (let i = 0; i < [num]; i++) {
          let urlpro = `https://api.lolicon.app/setu/v2?r18=${r18}` //←此处修改图片类型，0为非18，1为18，2为18非18混合
          let response = await fetch(urlpro)
          let obj = await response.json()
          data.push([
            `作品id(pid): ${obj.data[0].pid}\n`,
            `作者id(uid): ${obj.data[0].uid}\n`,
            `作者: ${obj.data[0].author}\n`,
            `标题: ${obj.data[0].title}\n`,
            `r18: ${obj.data[0].r18 ? '是' : '否'}\n`,
            `标签: ${obj.data[0].tags}\n`,
            `日期: ${new Date(obj.data[0].uploadDate).toLocaleDateString()}\n`,
            `已获取图片第${i + 1}张\n`,
            segment.image(obj.data[0].urls.original)
          ])
          logger.info(obj)
          await common.sleep(1000)
        }
        dec = `${e.sender.card || e.sender.nickname}(${e.user_id
          })你的lolicon，已经帮你整理好了请查收...`
        ForwardMsg = await common.makeForwardMsg(e, data, dec, msgsscr)
        makeMsg = await e.reply(ForwardMsg)
      }
      if (!makeMsg) {
        e.reply('好、好涩(//// ^ ////)……不、不行啦……被、被吞啦o(≧口≦)o')
      }
    } else {
      await e.reply('未开启色图功能')
    }
    return false
  }
}
