/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:24:59
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:18:48
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
import fetch from 'node-fetch'
export class MadnessThursday extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'KFC疯狂星期四',
      /** 功能描述 */
      dsc: '获取网页疯狂星期四文案随机发送',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1003,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^#*(疯狂)*星期四$',
          /** 执行方法 */
          fnc: 'Crazy4'
        }
      ]
    })
  }
  /**
   * @param e oicq传递的事件参数e
   */
  async Crazy4(e) {
    let url = 'https://www.sxsme.com.cn/gonglue/14216.html'
    let response = await fetch(url) //调用接口获取数据
    let res = await response.text()
    let regFC4 = /<hr \/>([\s\S]*?)<hr \/>/g
    let textFC4 = res.match(regFC4)
    let delFC4 = []
    for (const key in textFC4) {
      if (textFC4[key].match(/<table([\s\S]*?)<\/table>/g)) {
        textFC4[key] = textFC4[key].replace(/<table([\s\S]*?)<\/table>/g, '<hr /><hr />')
        delFC4.push(key)
        let temp = textFC4[key].match(regFC4)
        for (const tempkey in temp) {
          textFC4.push(temp[tempkey])
        }
      }
    }
    for (const key in delFC4) {
      textFC4.splice(delFC4[key], 1)
    }
    for (const key in textFC4) {
      textFC4[key] = textFC4[key].replace(/<hr \/>|<p>|<\/p>|&nbsp;|\r|\n|<br \/>/g, '')
      textFC4[key] = textFC4[key].replace(/\t/g, '\n')
      if (textFC4[key].indexOf('\r')) {
        textFC4[key] = textFC4[key].slice(1)
      }
    }
    let imgregFC4 =
      /https:\/\/img.sxsme.com.cn\/uploadimg\/image\/[0-9]{7,8}\/[0-9A-Za-z_]{10,30}.jpg/g
    let imgFC4 = res.match(imgregFC4)
    for (const key in imgFC4) {
      textFC4.push(imgFC4[key])
    }
    let FC4 = textFC4[Math.round(Math.random() * (textFC4.length - 1))]
    await this.e.reply(FC4.includes('http') ? segment.image(FC4) : FC4)
  }
}
