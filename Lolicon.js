/**
 * @Author: Star Languag
 * @Date: 2023-05-02 16:20:47
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 14:24:24
 */
let time = 0 //撤回时间
let msgsscr = true //转发消息是否为机器人
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
import common from '../../lib/common/common.js'

export class Lolicon extends plugin {
  constructor() {
    super({
      name: 'lolicon',
      dsc: 'st',
      event: 'message',
      priority: 5000,
      rule: [
        {
          reg: '^#?(白毛|黑丝|原神|图片)(.*)',
          fnc: 'js'
        }
      ]
    })
  }

  async js(e) {
    let num = e.msg.match(/[一二两三四五六七八九十]|[1-9]\d*/g) || 1
    //汉字转换为数字
    let dic = {
      一: 1,
      二: 2,
      两: 2,
      三: 3,
      四: 4,
      五: 5,
      六: 6,
      七: 7,
      八: 8,
      九: 9,
      十: 10
    }
    //如果不是纯数字则转换成纯数字
    if (!(!isNaN(parseFloat(num)) && isFinite(num))) {
      if (num.length < 2) num = dic[num]
      else num = 10
    }
    let tupan = [
      'https://api.wdvipa.com/sj', //二次元
      'https://api.wdvipa.com/pe', //调用pe(手机端)
      'https://api.wdvipa.com/ys', //原神
      'https://api.wdvipa.com/bm', //白毛
      'https://api.wdvipa.com/hs' //黑丝
    ]
    if (num > 20) {
      e.reply('最多只能给20张!!!')
      return true
    }
    console.info(num)
    //关键字匹配
    let randomElement
    if (e.msg.includes('原神')) {
      randomElement = tupan[2]
    } else if (e.msg.includes('白毛')) {
      randomElement = tupan[3]
    } else if (e.msg.includes('黑丝')) {
      randomElement = tupan[4]
    } else {
      //随机图片
      const randomIndex = Math.floor(Math.random() * tupan.length)
      randomElement = tupan[randomIndex]
    }
    //如果是一张直接发出去
    if (!num || num == 1) {
      e.reply([segment.image(randomElement)], false, {
        recallMsg: time
      })
      return true
    }
    //多张图片合并转发
    let msgList = []
    for (let i = 0; i < [num]; i++) {
      let msg = `已获取图片第${i + 1}张`
      msgList.push([segment.image(randomElement), msg])
    }
    //转发描述
    let dec = `${e.sender.card || e.sender.nickname}(${e.user_id
      })你的东西，已经帮你整理好了请查收......`
    const forwardMsg = await common.makeForwardMsg(e, msgList, dec, msgsscr) //消息转发
    await e.reply(forwardMsg) //发送消息
  }
}
