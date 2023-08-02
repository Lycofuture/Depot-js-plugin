/**
 * @Author: Lycofuture
 * @Date: 2022-11-05 16:04:52
 * @LastEditors: Lycofuture
 * @LastEditTime: 2023-08-02 18:37:14
 * 因为没有，所以才有
 * \(^o^)/ 17:45:17 摆烂！
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
export class ByDay extends plugin {
  constructor() {
    super({
      name: '日群友',
      dsc: '随机给一位群友注射脱氧核糖核酸',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?日群友$',
          fnc: 'fuck'
        }
      ]
    })
  }

  async fuck(e) {
    console.log('用户命令：', e.msg)
    const num = Math.round(Math.random() * 100)
    const map = await e.group.getMemberMap()
    const arrMember = Array.from(map.values())
    const getForumPostList = arrMember.filter(v => v.user_id !== e.user_id && v.user_id !== Bot.uin)
    const group = getForumPostList[Math.round(Math.random() * getForumPostList.length)]
    let msg;
    // let num = 11;  // 测试
    if (num < 5) {
       msg = [segment.at(e.user_id), '你也配？自己默默导管吧！']
      await e.reply(msg)
    } else if (num < 10) {
       msg = [segment.at(e.user_id), '呜呜呜，只因无力(╯‵□′)╯︵┻━┻，你直接日歪了，细狗']
      await e.reply(msg)
    } else if (num < 11) {
       msg = [
        segment.at(e.user_id),
        '万中无一，孤独终老。\n\n（这么低的概率也能命中请速速去抽卡买彩票，作者都想不到会有人能中~）'
      ]
      await e.reply(msg)
    } else if (num < 75) {
       msg = [
        segment.at(e.user_id),
        `成功给『${group.card||group.nickname}』(${group.user_id})注射了脱氧核糖核酸~`,
        segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${group.user_id}`)
      ]
      await e.reply(msg)
    } else {
       msg = [
        '恭喜你',
        segment.at(e.user_id),
        `和『${group.card||group.nickname}』(${group.user_id})喜结良缘❤`,
        segment.image(`https://q1.qlogo.cn/g?b=qq&s=0&nk=${group.user_id}`)
      ]
      await e.reply(msg)
    }
  }
}
