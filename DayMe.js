/**
 * @Author: Lycofuture
 * @Date: 2022-11-08 17:39:32
 * @LastEditors: Lycofuture
 * @LastEditTime: 2023-07-29 10:23:32
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
export class DayMe extends plugin {
  constructor() {
    super({
      name: '被群友日',
      dsc: '随机被一位群友注射脱氧核糖核酸',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?日我$',
          fnc: 'fuckme'
        }
      ]
    })
  }
  async fuckme(e) {
    console.log('用户命令：', e.msg)
    const map = await e.group.getMemberMap()
    const arrMember = Array.from(map.values())
    const getForumPostList = arrMember.filter(v => v.user_id !== e.user_id && v.user_id !== Bot.uin)
    const group = getForumPostList[Math.round(Math.random() * getForumPostList.length)]
    const msg = [
      segment.at(e.user_id),
      `被『${group.card||group.nickname}』(${group.user_id})狠狠地注射了脱氧核糖核酸~`,
      segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${group.user_id}`)
    ]
    await e.reply(msg)
  }
}
