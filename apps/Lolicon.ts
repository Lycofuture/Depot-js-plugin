/*
 * @Author: Star Languag
 * @Date: 2023-05-02 16:20:47
 * @Last Modified by: Lycofuture
 * @Last Modified time: 2023-07-02 15:56:03
 *
 */

import { plugin, Messagetype } from 'alemon'
import fetch from 'node-fetch'
export class Lolicon extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^\/?(白毛|黑丝|原神|图片)(.*)/,
          fnc: 'lolicon'
        }
      ]
    })
  }
  async lolicon(e: Messagetype): Promise<boolean> {
    console.log('[lolicon]', '任务触发')
    let num: number | RegExpMatchArray = e.cmd_msg.match(/d+/g)
    if (!num) {
      num = Number(1)
    }
    console.log(num)
    const tupan = [
      'https://api.wdvipa.com/sj', //二次元
      'https://api.wdvipa.com/pe', //调用pe(手机端)
      'https://api.wdvipa.com/ys', //原神
      'https://api.wdvipa.com/bm', //白毛
      'https://api.wdvipa.com/hs' //黑丝
    ]
    let randomElement: string
    if (e.cmd_msg.includes('原神')) {
      randomElement = tupan[2]
    } else if (e.cmd_msg.includes('白毛')) {
      randomElement = tupan[3]
    } else if (e.cmd_msg.includes('黑丝')) {
      randomElement = tupan[4]
    } else {
      //随机图片
      const randomIndex = Math.floor(Math.random() * tupan.length)
      randomElement = tupan[randomIndex]
    }
    if (typeof num === 'number') {
      if (num > 50) {
        e.reply('最多只能给50张！！！')
        return true
      }
      for (let i = 0; i < num; i++) {
        console.log((await e.reply(await imageurl(randomElement)), `发送图片${i + 1}张`))
        await sleep(1000) //太快了，延迟一下
      }
    } else {
      await e.reply(await imageurl(randomElement))
    }
    console.log('[lolicon]', ' 执行完毕')
    return false
  }
}
/**
 * @description:
 * @param {number} ms - 等待时间以毫秒为单位
 * @return {*}
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @description:
 * @param {string} url - 返回Buffer数据
 * @return {*}
 */
async function imageurl(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('访问错误：', error)
    return error.Message
  }
}
