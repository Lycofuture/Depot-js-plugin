/*
 * @Author: Lycofuture
 * @Date: 2023-06-30 17:09:45
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 13:48:45
 */
import { plugin, Messagetype } from 'alemon'
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
      rule: [
        {
          fnc: 'message'
        }
      ]
    })
  }
  async message(e: Messagetype): Promise<boolean> {
    const data = fs.readFileSync(pathDsf, 'utf-8')
    const jsonData = JSON.parse(data)
    if (e.msg.id) {
      jsonData.push({ [e.msg.id]: e })
    } else {
      jsonData.push({ [e.msg.author.id]: e })
    }
    fs.writeFileSync(pathDsf, JSON.stringify(jsonData, null, 2))
    return false
  }
}
