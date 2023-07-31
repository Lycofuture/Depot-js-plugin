/**
 * @Author: Lycofuture
 * @Date: 2023-05-18 15:32:45
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-31 13:45:28
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
import cfg from '../../lib/config/config.js'
import common from '../../lib/common/common.js'
import fetch from 'node-fetch'
import md5 from 'md5'
const groupList = await Bot.gl

export class GroupAll_user extends plugin {
  constructor() {
    super({
      name: '广播',
      dsc: '对所有群聊发送消息',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: /^#?广播$/,
          fnc: 'getAll'
        },
        {
          reg: /^#?群列表$/,
          fnc: 'getgroup'
        }
      ]
    })
  }

  async getAll(e) {
    if (cfg.masterQQ.includes(e.user_id)) {
      this.setContext('groupall')
      await e.reply('请发送广播内容')
    }
  }

  async getgroup(e) {
    let msg = [], num = 0
    for (let group of groupList) {
      const tim = new Date()
      const data = group[1]
      let userName = await Bot.getStrangerInfo(data.owner_id)
      const url = `https://p.qlogo.cn/gh/${data.group_id}/${data.group_id}/0`
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const image = Buffer.from(arrayBuffer)
      msg.push([
        `群聊: 『${data.group_name}』(${data.group_id})\n`,
        `群主: 『${userName.nickname}』(${data.owner_id})\n`,
        `群员数量: ${data.member_count}\n`,
        segment.image(image)
      ])
      logger.info('群聊列表', md5(tim))
      num++
    }
    const dec = `群列表中共计${num}个群聊`
    const fake = await common.makeForwardMsg(e, [dec, ...msg], dec)
    await e.reply(fake)
    return false
  }

  async groupall() {
    let coutn = 0, count = 0, msg = ''
    const modifiedMsg = this.e.message
    try {
      if (this.e.isGroup) {
        groupList.delete(this.e.group_id)
      }
      for (let group of groupList) {
        const data = group[1]
        if ((data.shutup_time_whole || data.shutup_time_me) > 0) {
          this.e.reply(
            `无法向群组 『${data.group_name}』(${data.group_id})发送消息：该群组可能已被禁言`
          )
          coutn++
        } else {
          //采用gocqhttp的方法
          await Bot.sendGroupMsg(data.group_id, modifiedMsg)
          await this.e.reply(`向群聊『${data.group_name}』(${data.group_id})发送消息成功`)
          await common.sleep(10 * 1000)
          count++
        }
      }
      if (coutn !== 0) {
        msg = `成功失败${coutn}个群聊`
      }
      await this.e.reply(`成功发送${count}个群聊\n${msg}`)
    } catch (err) {
      console.log('发生了错误:', err)
    }
    this.finish('groupall')
  }
}
