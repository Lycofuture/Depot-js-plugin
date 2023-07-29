/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:10:00
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:23:47
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
let urls_one = segment.image('https://api.andeer.top/API/word_pic1.php')
export class DianZan extends plugin {
  constructor() {
    super({
      name: '点赞',
      dsc: '点赞',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: /^#?(点赞|赞我|点zan)$/,
          fnc: 'thuMUp'
        }
      ]
    })
  }
  async thuMUp(e) {
    if ((e.bot ?? Bot).config.platform == 3) {
      return logger.error(`${e.logFnc}手表协议暂不支持点赞请更换协议后重试`)
    } else if (e.isGroup) {
      /** 判断是否为好友 */
      let isFriend = await (e.bot ?? Bot).fl.get(e.user_id)
      /** 点赞最大值 **/
      let MAX_LIKES = 20
      let n = 0
      /** 点赞成功回复的图片 */
      let imgs = [
        'https://api.andeer.top/API/img_good.php?qq='
        //'https://xiaobai.klizi.cn/API/ce/zan.php?qq=',
        // "https://xiaobai.klizi.cn/API/ce/xin.php?qq=",
        //'http://ovooa.com/API/zan/api.php?QQ=',
        //'http://api.caonm.net/api/bix/b.php?qq=',
        //'http://api.caonm.net/api/kan/kan_3.php?qq='
      ]
      /**随机图片处理**/
      let random = Math.floor(Math.random() * (imgs.length - 0))
      let successImg = segment.image(imgs[random] + e.user_id)
      /**点赞失败图片**/
      let faildsImg = segment.image(`https://api.andeer.top/API/img_crawl.php?qq=${e.user_id}`)
      /**开始执行点赞**/
      let failsmsg = '今天已经点过了，还搁这讨赞呢！！！'
      if (isFriend) {
        while (n < MAX_LIKES) {
          // 好友点赞
          let res = await Bot.sendLike(e.user_id, 1)
          logger.debug(`${e.logFnc}好友点赞`, res)
          if (res) {
            n += 1
          } else break
        }
        /** 回复的消息 */
        let successResult = [
          '\n',
          `赞了${n}下噢喵~,可以..可以回我一下嘛o(*////▽////*)q~`,
          successImg
        ]
        let faildsResult = ['\n', failsmsg, faildsImg]
        /** 判断点赞是否成功 */
        let msg = n > 0 ? successResult : faildsResult
        /** 回复 */
        await e.reply(msg, true, {
          at: true
        })
      } else if (!isFriend) return e.reply(['不加好友不点🙄', urls_one], true)
    } else {
      await Bot.sendLike(e.user_id, 20)
      await e.reply('赞了噢喵~,可以..可以回我一下嘛o(*////▽////*)q~,没点上请加我好友再发【点赞】~')
    }
    return false
  }
}
