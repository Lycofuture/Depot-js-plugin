/**
 * @Author: Lycofuture
 * @Date: 2023-05-18 15:32:45
 * @LastEditors: Lycofuture
 * @LastEditTime: 2023-08-02 20:00:05
 */
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
import plugin from '../../lib/plugins/plugin.js'
import cfg from '../../lib/config/config.js'
import common from '../../lib/common/common.js'
import fetch from 'node-fetch'
import md5 from 'md5'

let groupList = Array.from(await Bot.gl.values())

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
    await e.reply('正在获取请稍后...')
    for (let group of groupList) {
      const tim = new Date()
      let userName = await Bot.getStrangerInfo(group.owner_id)
      const url = `https://p.qlogo.cn/gh/${group.group_id}/${group.group_id}/0`
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const image = Buffer.from(arrayBuffer)
      msg.push([
        `群聊: 『${group.group_name}』(${group.group_id})\n`,
        `群主: 『${userName.nickname}』(${group.owner_id})\n`,
        `群员数量: ${group.member_count}\n`,
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
    if (modifiedMsg) {
      this.finish('groupall')
      try {
        if (this.e.isGroup) {
          groupList = groupList.filter(v => v.group_id !== this.e.group_id)
        }
        let min = Math.floor(Math.random() * 21) + 10
        await this.e.reply(`开始广播，发送群聊数量 ${groupList.length} 个\n预计完成时间: ${formatTime(min * groupList.length)}`)
        for (let group of groupList) {
          if ((group.shutup_time_whole || group.shutup_time_me) > 0) {
            this.e.reply(
              `无法向群组 『${group.group_name}』(${group.group_id})发送消息：该群组可能已被禁言`
            )
            coutn++
          } else {
            //采用gocqhttp的方法
            await Bot.sendGroupMsg(group.group_id, modifiedMsg)
            await this.e.reply(`向群聊『${group.group_name}』(${group.group_id})发送消息成功`)
            min = Math.floor(Math.random() * 21) + 10
            await common.sleep(min * 1000)
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
    }
  }
}
/*******
 * @description:
 * @param  时间秒
 * @return 格式化时间
 */
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  let formattedTime = "";
  if (hours > 0) {
    formattedTime += hours + "小时 ";
  }
  if (minutes > 0) {
    formattedTime += minutes + "分钟 ";
  }
  if (remainingSeconds > 0) {
    formattedTime += remainingSeconds + "秒";
  }
  return formattedTime.trim();
}
