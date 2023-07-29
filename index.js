/**
 * @Author: Lycofuture
 * @Date: 2023-07-02 17:47:10
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:15:51
 */

import fs from 'node:fs'
import { fileURLToPath } from 'url';
import path from 'node:path'
if (!global.segment) {
  try {
    global.segment = (await import('oicq')).segment
  } catch (err) {
    try {
      global.segment = (await import('icqq')).segment
    } catch { }
  }
}
if (!global.core) {
  try {
    global.core = (await import('oicq')).core
  } catch (err) {
    try {
      global.core = (await import('icqq')).core
    } catch { }
  }
}
const hexToRgb = hex => hex.match(/.{2}/g).map(val => parseInt(val, 16))
const gradientColor = (text, startColor, endColor) => {
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
const currentPath = fileURLToPath(new URL(import.meta.url))
let dir = path.dirname(currentPath)
const files = fs.readdirSync(dir).filter(file => file.endsWith('.js') && file !== 'index.js')

logger.info(gradientColor('------ (ಡωಡ) ------', 'FF00FF', '00FFFF'))
logger.info(gradientColor('js插件库初始化中~~~', 'FF00FF', '00FFFF'))
let ret = []
files.forEach(file => {
  ret.push(import(`./${file}`))
})
ret = await Promise.allSettled(ret)
let apps = {}
for (let i in files) {
  let name = files[i].replace('.js', '')
  if (ret[i].status !== 'fulfilled') {
    logger.error(`载入插件错误：${logger.red(name)}`)
    logger.error(ret[i].reason)
    const errorMessage = ret[i].reason.toString()
    if (errorMessage.includes("package")) {
      logger.warn(
        `[${name}]缺少依赖 ，请执行 ${gradientColor(
          'pnpm -C ./plugins/Depot-js-plugin/ install',
          'F0072C6',
          'FDB813'
        )} 安装依赖`
      )
    } else {
      logger.error(`载入插件错误：${logger.red(name)}`)
      logger.error(ret[i].reason)
    }
  } else {
    apps[name] = ret[i].value[Object.keys(ret[i].value)[0]]
    logger.info(gradientColor(`[${name}]载入成功！`, 'FF00FF', '00FFFF'))
  }
}
logger.info(gradientColor('初始化成功!', 'FF00FF', '00FFFF'))
logger.info(
  gradientColor('仓库地址 https://gitee.com/lycofuture/Depot-js-plugin.git', 'FF00FF', '00FFFF')
)
logger.info(gradientColor('--------------------', 'FF00FF', '00FFFF'))

export { apps }
