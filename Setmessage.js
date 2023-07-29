/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:07:53
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:31:08
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
import fs from 'fs'
const pathToDir = `${process.cwd()}/data/message`
if (!fs.existsSync(pathToDir)) {
  // 如果目录不存在，则创建它
  fs.mkdirSync(pathToDir)
}
const pathDsf = `${pathToDir}/msg.json`
if (!fs.existsSync(pathDsf)) {
  // 如果文件不存在，则创建它并初始化值
  fs.writeFileSync(pathDsf, '[]')
}
export class Setmessage extends plugin {
  constructor() {
    super({
      name: '消息事件',
      dsc: '消息存储',
      event: 'message',
      priority: 1
    })
  }
  async accept(e) {
    if (e.user_id == (e.bot ?? Bot).uin) return false //判断是否为机器人
    // if (cfg.masterQQ.includes(Number(e.user_id))) return false //判断是否为主人
    try {
      let data = fs.readFileSync(pathDsf, 'utf-8')
      if (!data) {
        data = []
      }
      const records = JSON.parse(data)
      let dsc = {}
      if (e.isGroup) {
        dsc[e.user_id] = `${e.message_id},${JSON.stringify(e.message)}`
        logger.debug(`存储群消息${e.group_id}=> ${e.message_id}`)
      } else if (e.isPrivate) {
        dsc[e.user_id] = `${e.message_id},${JSON.stringify(e.message)}`
      }
      records.push(dsc)
      fs.writeFileSync(pathDsf, JSON.stringify(records, null, 2))
    } catch (error) {
      console.error(error)
    }
    return false
  }
}
