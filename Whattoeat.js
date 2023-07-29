/**
 * @Author: Yuzichai
 * @Date: 2023-04-05 17:07:53
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:28:17
 * 需要安装依赖 pnpm add -w jszip
 * 更新下载链接的重定向
 * 修复第一次启动的报错
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
import JSZip from 'jszip'
import YAML from 'yaml'
let foods_whitelist = []
export class Whattoeat extends plugin {
  constructor() {
    super({
      name: '今天吃什么',
      dsc: '看看今天吃啥',
      event: 'message',
      priority: 500,
      rule: [
        {
          reg: '^(今|今天|今儿)?(早|早上|早餐|早饭)(吃|恰)(甚|甚么|什么|啥|点啥)(.+)?',
          fnc: 'random_breakfast'
        },
        {
          reg: '^(.+)?(今天|[中午晚][饭餐午上]|夜宵|今晚)(吃|恰)(甚|甚么|什么|啥|点啥)(.+)?$',
          fnc: 'net_ease_cloud_word'
        },
        {
          reg: '^换菜单(正常模式|来点硬菜|用户模式)$',
          fnc: 'change_menu'
        }
      ]
    })
    this.imgpath = `${process.cwd()}/data/example/whattoeat`
    this.config = `${this.imgpath}/user_config.yaml`
  }
  /* 初始化数据包 */
  async init() {
    try {
      if (!fs.existsSync(this.imgpath)) {
        // 如果目录不存在，则创建它
        fs.mkdirSync(this.imgpath, {
          recursive: true
        })
      }
      if (!fs.existsSync(this.config)) {
        logger.warn('[今天吃什么]数据包下载中...')
        await downloadAndExtractZip(
          'https://gitee.com/lycofuture/Depot-js-plugin/releases/download/v1.0/whattoeat.zip',
          'data/example'
        )
        logger.info('[今天吃什么]数据包下载完成')
      } else {
        logger.info('[今天吃什么]数据包已存在，无需下载')
      }
    } catch (error) {
      logger.info('下载出错', count)
      logger.info(error)
    }
  }
  async random_breakfast(e) {
    if (!this.imgpath) {
      await this.init()
    }
    e.msg = e.msg.replace(/吃什么/g, '')
    let user_config = YAML.parse(fs.readFileSync(this.config, 'utf8'))
    if (user_config[e.user_id] === undefined) {
      user_config[e.user_id] = {
        menu: 1
      }
      fs.writeFileSync(this.config, YAML.stringify(user_config))
    }
    if (user_config[e.user_id].menu === 1) {
      const files = fs.readdirSync(`${this.imgpath}/foods/breakfast`)
      let k = Math.ceil(Math.random() * files.length)
      let o = files[k].replace(/.jpg|.png/g, '')
      let msg = [
        `${e.msg}去吃${o}吧~`,
        segment.image(`${this.imgpath}/foods/breakfast/${files[k]}`)
      ]
      await e.reply(msg)
    } else {
      const extra = fs.readdirSync(`${this.imgpath}/foods/extra`)
      let n = Math.ceil(Math.random() * extra.length)
      let i = extra[n].replace(/.jpg|.png/g, '')
      let msg = [`${e.msg}去吃${i}吧~`, segment.image(`${this.imgpath}/foods/extra/${extra[n]}`)]
      await e.reply(msg)
    }
  }

  async net_ease_cloud_word(e) {
    e.msg = e.msg.replace(/吃什么/g, '')
    let user_config = YAML.parse(fs.readFileSync(this.config, 'utf8'))
    if (user_config[e.user_id] === undefined) {
      user_config[e.user_id] = {
        menu: 1
      }
      fs.writeFileSync(this.config, YAML.stringify(user_config))
    }
    if (user_config[e.user_id].menu == 1) {
      const files = fs.readdirSync(`${this.imgpath}/foods/dinner`)
      let k = Math.ceil(Math.random() * files.length)
      let o = files[k].replace(/.jpg|.png/g, '')
      let msg = [`${e.msg}去吃${o}吧~`, segment.image(`${this.imgpath}/foods/dinner/${files[k]}`)]
      await e.reply(msg)
    } else {
      const extra = fs.readdirSync(`${this.imgpath}/foods/extra`)
      let n = Math.ceil(Math.random() * extra.length)
      let i = extra[n].replace(/.jpg|.png/g, '')
      let msg = [`${e.msg}去吃${i}吧~`, segment.image(`${this.imgpath}/foods/extra/${extra[n]}`)]
      await e.reply(msg)
    }
  }

  async change_menu(e) {
    let user_config = YAML.parse(fs.readFileSync(this.config, 'utf8'))
    let ret = e.msg.replace(/换菜单/g, '')
    if (user_config[e.user_id] === undefined) {
      user_config[e.user_id] = {
        menu: 1
      }
    } else {
      if (ret == '正常模式') {
        if (user_config[e.user_id].menu === 1) {
          await e.reply('已经是正常菜式了哦')
        } else {
          user_config[e.user_id].menu = 1
          const yami = `file:///${this.imgpath}/koinori/yami.png`
          await e.reply(['切换成功，果然还是正常的好吃呢~', segment.image(yami)])
        }
      }
      if (ret === '来点硬菜') {
        if (user_config[e.user_id].menu == 2) {
          const jiii = `file:///${this.imgpath}/koinori/jiii.png`
          await e.reply(['您已经站在了食物链的顶端！', segment.image(jiii)])
        } else {
          user_config[e.user_id].menu = 2
          const kowai = `file:///${this.imgpath}/koinori/kowai.png`
          await e.reply(['切...切换成功...', segment.image(kowai)])
        }
      }
      if (ret === '用户模式') {
        if (user_config[e.user_id].menu == 3) {
          user_config[e.user_id].menu = 3
          await e.reply('已经在自定义模式里了~')
        } else {
          let message = '已经切换到用户自定义模式了~'
          if (foods_whitelist.some(item => e.group_id.includes(item))) {
            message += '使用"添菜"添加菜肴~'
          }
          await e.reply(message)
        }
      }
      fs.writeFileSync(this.config, YAML.stringify(user_config))
    }
  }
}
/**
 * @param {string} url - 下载zip链接
 * @param {string} outputPath -  解压缩后保存的路径
 * 返回值: Promise对象，成功时不带参数，失败时抛出错误对象。
 */
const downloadAndExtractZip = async (url, outputPath) => {
  try {
    // 获取服务器上的zip文件
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()

    // 使用JSZip解压缩zip文件
    const zip = new JSZip()
    const loadedZip = await zip.loadAsync(arrayBuffer)

    const totalFiles = Object.keys(loadedZip.files).length
    let completedFiles = 0

    process.stdout.write('[')

    // 遍历zip文件中的每个文件
    for (const [relativePath, zipEntry] of Object.entries(loadedZip.files)) {
      // 提取目录路径
      const dirPath = `${outputPath}/${relativePath.substr(0, relativePath.lastIndexOf('/'))}`

      // 检查文件是否为目录
      if (zipEntry.dir) {
        // 创建目录
        fs.mkdirSync(dirPath, { recursive: true })
      } else {
        // 提取文件内容
        const content = await zipEntry.async('nodebuffer')
        // 处理文件内容，例如保存到本地
        fs.writeFileSync(`${outputPath}/${relativePath}`, content)
      }

      completedFiles++
      const progress = Math.floor((completedFiles / totalFiles) * 20)

      // 打印进度条
      process.stdout.write('='.repeat(progress))
      process.stdout.write('>'.repeat(1))
      process.stdout.write(' '.repeat(20 - progress))
      process.stdout.write(`] ${completedFiles}/${totalFiles}`)

      // 光标回到行首
      process.stdout.write('\r')

      // 打印一个换行符，刷新输出并显示进度条
      process.stdout.write('\n')
    }
  } catch (error) {
    console.error('错误:', error)
  }
}
