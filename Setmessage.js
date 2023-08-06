/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:07:53
 * @LastEditors: Lycofuture
 * @LastEditTime: 2023-07-30 09:53:42
 */
if (!global.segment) {
  try {
    global.segment = (await import('icqq')).segment
  } catch {
    try {
      global.segment = (await import('oicq')).segment
    } catch {
    }
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
  // 每次启动清空缓存
  async init() {
    let records = []
    fs.writeFileSync(pathDsf, JSON.stringify(records))
  }

  async accept(e) {
    if (e.user_id === Bot.uin) return false //判断是否为机器人
    // if (cfg.masterQQ.includes(e.user_id)) return false //判断是否为主人
    try {
      const data = fs.readFileSync(pathDsf, 'utf-8')
      let records
      try {
        records = JSON.parse(data)
      } catch {
        records = []
      }
      let dsc = {}
      const id = e.message_id
      dsc[e.user_id] = `${id},${JSON.stringify(e.message)}`
      logger.debug(`存储群消息${e.group_id}=> ${e.message_id}`)
      records.push(dsc)
      fs.writeFileSync(pathDsf, JSON.stringify(records, null, 2))
      deck(id)//每条消息缓存30分钟
    } catch (error) {
      console.error(error)
    }
    return false
  }
}

/******* 
 * @description: 
 * @param {number} id - 定时删除
 */
function deck(id) {
  setTimeout(() => {
    let records = JSON.parse(fs.readFileSync(pathDsf, 'utf-8'))
    records = records.filter(item => {
      const record = item[Object.keys(item)[0]].split(',')
      const userId = record[0]
      return userId !== id
    })
    fs.writeFileSync(pathDsf, JSON.stringify(records, null, 2))
  }, 3 * 60 * 1000)
}
