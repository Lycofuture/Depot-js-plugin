/**
 * @Author: xianxincoder
 * @Date: 2023-05-02 17:15:19
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:41:44
 * 根据woc插件修改的随机图片
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
// 合并转发中的发送者是机器人还是用户。设为true是机器人，设为false是用户
const botsender = false
const cd = 30
//woc图片接口
const imageUrl = 'https://iw233.cn/api.php?sort=iw233'
const masterCD = false //主人是否受woccd限制
import plugin from '../../lib/plugins/plugin.js'
import fs from 'fs'
import moment from 'moment'
let pathToDir = `${process.cwd()}/data/example`
if (!fs.existsSync(pathToDir)) {
  // 如果目录不存在，则创建它
  fs.mkdirSync(pathToDir, {
    recursive: true
  })
}
const pathgpt = `${pathToDir}/woc.json`
if (!fs.existsSync(pathgpt)) {
  // 如果文件不存在，则创建它并初始化值
  fs.writeFileSync(
    pathgpt,
    JSON.stringify({
      lastUsedTime: 0
    })
  )
}
export class Wocrandom extends plugin {
  constructor() {
    super({
      name: 'Wocrandom',
      dsc: 'woc神秘指令',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: '^(卧槽|woc)$',

          fnc: 'wallpaper'
        },
        {
          reg: '^来(.*)(张|个)(((涩|色)*图)|(壁纸)|(老婆))$',
          fnc: 'wallpaper'
        },
        {
          reg: '^(卧槽|woc)plus',
          fnc: 'wocplus'
        }
      ]
    })
  }
  //woc神秘指令图片
  async wallpaper(e) {
    let currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    let lastTime = await redis.get(`Yz:wc:${this.e.group_id}`)
    if (lastTime && (!e.isMaster || (e.isMaster && masterCD))) {
      let seconds = moment(currentTime).diff(moment(lastTime), 'seconds')
      this.e.reply(`cd中，请等待${cd - seconds}秒后再使用`)
      return true
    }
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
      十: 10,
      几: 0
    }
    let num = e.msg.replace(/来|张|个|(色|涩)*图|(壁纸)|(老婆)/g, '')
    console.log(num)
    // 如果num不是纯数字
    if (!(!isNaN(parseFloat(num)) && isFinite(num))) {
      if (num.length < 2) num = dic[num]
      else num = 11
    }
    // 0表示随机3~10张
    if (num == 0) num = Math.floor(Math.random() * 8 + 3)
    // 一张的话就直接发出去
    if (!num || num == 1) {
      e.reply([segment.image('https://iw233.cn/api.php?sort=iw233')], false, {
        recallMsg: wocwithdrawTimer
      })
      return true
    }
    if (e.msg.includes('卧槽') || e.msg.includes('woc')) {
      this.e.reply('触发探索未知的神秘空间，请稍等...')
      num = 10
    } else {
      this.e.reply(`${num > 10 ? '色批，一次最多十张！' : ''}探索中，请稍等`)
    }
    if (num > 10) num = 10
    console.log(num)
    let msgList = []
    const forwarder = botsender
      ? {
        nickname: Bot.nickname,
        user_id: Bot.uin
      }
      : {
        nickname: this.e.sender.card || this.e.user_id,
        user_id: this.e.user_id
      }
    for (let i = 0; i < num; i++) {
      msgList.push({
        // message: segment.image("https://dev.iw233.cn/api.php?sort=random")
        message: segment.image(imageUrl),
        ...forwarder
      })
      console.info()
      // await common.sleep(300)
    }
    let res
    if (e.isGroup) res = await e.reply([await e.group.makeForwardMsg(msgList)], false)
    else res = await e.reply([await e.friend.makeForwardMsg(msgList)], false)
    console.log('res:', res)
    if (!res) {
      e.reply('别等了，你想要的已经被来自mht的神秘力量吞噬了')
      return false
    }
    currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    await redis.set(`Yz:wc:${this.e.group_id}`, currentTime, {
      EX: cd
    })
    return true
  }
  //wocplus神秘指令视频-
  async wocplus(e) {
    await this.e.reply('触发探索未知的神秘空间，请稍等...')
    // let datawoc = await fetchData(`https://v.api.aa1.cn/api/api-dy-girl/index.php?aa1=json`);
    try {
      // await e.reply(segment.video(`https:${datawoc.mp4}`))
      await e.reply(await segment.video('http://api.caonmtx.cn/api/ksbz.php'))
    } catch (error) {
      e.reply(`视频获取失败或链接失效`)
      console.info(`视频获取失败或链接失效,放行指令`)
      return false
    }
    return true
  }
}
