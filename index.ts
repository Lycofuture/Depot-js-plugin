/*
 * @Author: Lycofuture
 * @Date: 2023-06-30 17:14:38
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:08:51
 */
import { createApps } from 'alemon'
import os from 'os'
import fs from 'node:fs'
import { dirname, basename } from 'node:path'
import { fileURLToPath } from 'url'
let __dirname = dirname(fileURLToPath(import.meta.url))
const gradientColor = text => {
  const startColor = 'FF00FF'
  const endColor = '00FFFF'
  const steps = text.length - 1
  const startRGB = hexToRgb(startColor)
  const endRGB = hexToRgb(endColor)
  let colorText = ''
  for (let i = 0; i < text.length; i++) {
    const ratio = i / steps
    const rgb = [
      Math.floor((endRGB[0] - startRGB[0]) * ratio + startRGB[0]),
      Math.floor((endRGB[1] - startRGB[1]) * ratio + startRGB[1]),
      Math.floor((endRGB[2] - startRGB[2]) * ratio + startRGB[2])
    ]
    colorText += `\x1b[38;2;${rgb.join(';')}m${text[i]}`
  }
  return colorText + '\x1b[0m'
}
const hexToRgb = hex => hex.match(/.{2}/g).map(val => parseInt(val, 16))
console.info('[Example]', gradientColor('------ (ಡωಡ) ------'))
console.info('[Example]', gradientColor('js插件库初始化中~~~'))
if (os.platform() === 'win32') {
  if (__dirname.startsWith('/')) {
    __dirname = __dirname.substring(1)
  }
}
const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.ts') && file !== 'index.ts')

let ret = []
files.forEach(file => {
  ret.push(import(`./${file}`))
})
ret = await Promise.allSettled(ret)

for (const i in files) {
  const name = files[i].replace('.ts', '')
  if (ret[i].status == 'fulfilled') {
    console.info('[Example]', gradientColor(`[${name}]载入成功！`))
  } else {
    const errorMessage = ret[i].reason.toString()
    if (errorMessage.includes('package')) {
      console.warn(
        '[Example]',
        `[${name}]缺少依赖 ，请执行 ${gradientColor(
          'pnpm -C ./plugins/Depot-js-plugin/ install'
        )} 安装依赖`
      )
    } else {
      console.error('[Example]', ret[i].reason)
    }
    continue
  }
}
console.info(
  '[Example]',
  gradientColor('仓库地址 https://gitee.com/lycofuture/Depot-js-plugin.git')
)
console.info('[Example]', gradientColor('--------------------'))

// 插件名
const AppName = basename(__dirname)
// import { BotType, BotConfigType } from 'alemon'
// declare global {
//   //机器人信息
//   var robot: BotType
//   //机器人配置
//   var cfg: BotConfigType
// }

/* 重定义e消息方法 */

// import { PointMessageType } from './types.js'
// import { setMessage } from 'alemon'
// setMessage(AppName, (e: PointMessageType) => {
//   /* 当存在时 */
//   if (e.msg.user) {
//     /* 定义e.user为e.msg.user */
//     e.user = e.msg.user
//   }
//   /* 建议开发时在此处打印,用于观察 */
//   console.info(e)
//   return e
// })

/** 创建插件应用 */
await createApps(AppName)

// createApps('xiuxian-plugin')
