/**
 * @Author: Lycofuture
 * @Date: 2023-05-25 23:45:10
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:18:14
 */
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
if (!global.segment) {
  try {
    global.segment = (await import('icqq')).segment
  } catch {
    try {
      global.segment = (await import('oicq')).segment
    } catch { }
  }
}
export class KingRaiders extends plugin {
  constructor() {
    super({
      name: '王者角色攻略',
      dsc: '王者技能技巧、出装、英雄克制、搭配及铭文推荐',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: `^#?王者(.*)(攻略)$`,
          fnc: 'gycx'
        }
      ]
    })
  }
  async gycx(e) {
    let csed = e.msg
    let place = csed.replace(/^#?王者([\u4e00-\u9fa5]+)攻略$/, '$1').trim()
    let surl = `https://zj.v.api.aa1.cn/api/wz/?msg=${place}`
    let wzdata = await fetchData(surl)
    let sct = true
    try {
      if (wzdata) {
        e.reply(wzdata)
      } else {
        logger.info('消息交由Yunzai处理')
        sct = false
      }
    } catch (error) {
      logger.error(`[王者出装查询] 接口请求失败:${error}`)
      sct = false
    }
    async function fetchData(url) {
      let data
      try {
        const response = await fetch(url)
        const contentType = await response.headers.get('content-type')
        console.log(contentType)
        if (contentType.includes('application/json')) {
          data = await response.json()
        } else if (contentType.includes('text/html')) {
          data = await response.text()
        } else if (contentType.includes('application/xml')) {
          data = await response.text()
        } else {
          data = '不支持的类型'
        }
      } catch (error) {
        logger.error(error)
      }
      return data
    }
    return sct
  }
}
