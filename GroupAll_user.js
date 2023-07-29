/**
 * @Author: Lycofuture
 * @Date: 2023-05-18 15:32:45
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:24:23
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
export class GroupAll_user extends plugin {
  constructor() {
    super({
      name: '广播',
      dsc: '对所有群聊发送消息',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: /^#广播(.*)/,
          fnc: 'getAll'
        }
      ]
    })
  }
  /**
   * 群聊相关信息
   * @param {number} group_id - 群号
   * @param {string} group_name - 群名称
   * @param {number} member_count - 群成员数量
   * @param {number} max_member_count - 群最大容纳成员数
   * @param {number} owner_id - 群主 QQ 号
   * @param {number} last_join_time - 最后一个成员加入该群的时间（时间戳）
   * @param {number} shutup_time_whole - 全员禁言剩余时间（单位秒），0 表示未开启全员禁言
   * @param {number} shutup_time_me - 个人禁言剩余时间（单位秒），0 表示未被禁言
   * @param {boolean} admin_flag - 是否是管理员
   * @param {number} update_time - 群信息最后更新时间（时间戳）
   * @param {number} last_sent_time - 最后一条消息的发送时间（时间戳）
   * @param {number} create_time - 群创建时间（时间戳）
   * @param {number} grade - 群等级
   * @param {number} max_admin_count - 群最大管理员数量
   * @param {number} active_member_count - 活跃成员数量
   */
  async getAll(e) {
    if (cfg.masterQQ.includes(Number(this.e.user_id))) {
      this.setContext('groupall')
      await e.reply('请发送广播内容')
    }
  }
  async groupall() {
    let coutn = 0, count = 0
    let groupList = await Bot.getGroupList()
    const modifiedMsg = this.e.msg
    try {
      if (this.e.isGroup) {
        groupList = groupList.finish(time => time !== this.e.group_id)
      }
      for (let group of groupList.values()) {
        if ((group.shutup_time_whole || group.shutup_time_me) > 0) {
          this.e.reply(
            `无法向群组 『${group.group_name}』(${group.group_id})发送消息：该群组可能已被禁言`
          )
          coutn++
        } else {
          //采用gocqhttp的方法
          await Bot.sendGroupMsg(group.group_id, modifiedMsg)
          await this.e.reply(`向群聊『${group.group_name}』(${group.group_id})发送消息成功`)
          count++
          let min = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000
          await common.sleep(min)
        }
      }
      await this.e.reply(`成功发送${count}个群聊，失败${coutn}个群`)
    } catch (err) {
      console.log('发生了错误:', err)
    }
    this.finish('groupall')
  }
}
