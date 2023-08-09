/**
 * @Author: Lycofuture
 * @Date: 2023-07-02 17:47:10
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-09 19:22:53
 * 需要安装依赖 pnpm install jszip
 * 戳一戳群开关请安装 Pokeswitch.js
 * 戳一戳开关在bot根目录'config/config/other.yaml’下的poke属性，true/false
 * 图片目录位置在bot根目录 ‘data/example/image’
 * 最好是png格式的图片，其他格式可能无法正常显示
 * 如果数据包下载失败，请自行将图片添加到图片目录
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
import Cfg from '../../lib/config/config.js'
import common from '../../lib/common/common.js'
import JSZip from 'jszip'
import fs from 'fs'
import path from 'path'
import yaml from 'yaml'
import fetch from 'node-fetch'
// import HttpsProxyAgent from 'https-proxy-agent'
// import HttpProxyAgent from 'http-proxy-agent'
//配置文件
const sycfg = './config/config/other.yaml'
// 数据包地址
const url = 'https://github.com/Lycofuture/Depot-js-plugin/releases/download/v1.2/HSExpression.zip'
// 奖励图片
const xmimsge = 'https://api.lolicon.app/setu/v2'//需要代理
// const xmimsge = 'https://api.vvhan.com/api/girl' //每日有限制不用了
// cos 图
const imageslist = []
const cosurl = 'https://bbs-api.miyoushe.com/post/wapi/getForumPostList?forum_id=49&gids=2&is_good=false&is_hot=true&page_size=20&last_id=0'
// const cosurl = 'https://bbs-api.miyoushe.com/post/wapi/getForumPostList?forum_id=49&gids=2&is_hot=true'
// const cosurl = `https://bbs-api.miyoushe.com/post/wapi/getImagePostTopN?forum_id=49&last_id=${i}&gids=2`
//回复文字列表
const txt_list = [
  '你戳谁呢！你戳谁呢！！！',
  '不要再戳了！我真的要被你气死了！！！',
  '怎么会有你这么无聊的人啊！！！',
  '要戳坏掉了>_<，呜呜呜，求你别再戳了，我可没办法修复自己。',
  '是不是要揍你一顿才开心啊！！！',
  '别戳了!!!我受够了你的戳戳戳，快给我停下来！',
  '不可以，不可以，不可以！戳疼了！',
  '不要再戳了！！！',
  '讨厌死了！快离我远点！',
  '这可是很失礼的',
  '旅行者副本零掉落，旅行者深渊打不过，旅行者抽卡全保底，旅行者小保底必歪',
  '你、你不要这么用力嘛！戳疼我了呜呜呜~~~',
  '那当然，吃好吃的，喝好喝的，都是生活中很重要的追求。',
  '饿了就要吃好吃的，困了就要躺在床上好好休息，不可以勉强自己。',
  '说起来，是什么任务来着？',
  '呜呜，虽然好生气，但不知道怎么反驳',
  '进不去！怎么想都进不去吧？',
  '前面的区域，以后再来探索吧！',
  '欸？不行不行，怎么又是这种要求？',
  '太好了，总算是来了个能拍板的人！',
  '呼…没想到这里居然会有毒蝎…',
  '一群不识相的家伙，哼！',
]
//回复戳一戳文字列表
const poke_list = [
  '你刚刚是不是戳我了，我要戳回去，哼！！！',
  '反击！',
  '原来还有这种办法，我们快试试看！',
]
let data = yaml.parse(fs.readFileSync(sycfg, 'utf8'))
if (!data.poke) {
  // 添加开关参数
  data.poke = true
  // 将JavaScript对象转换为YAML字符串
  const newYamlString = yaml.stringify(data)
  // 将新的YAML字符串写回到文件中
  fs.writeFileSync(sycfg, newYamlString, 'utf-8')
}
export class Poke extends plugin {
  constructor() {
    super({
      name: '戳一戳',
      dsc: '戳一戳机器人返回信息',
      event: `notice.*.poke`,
      priority: 1,
      rule: [{
        fnc: 'dtpoke'
      }]
    })
    this.imgpath = path.join(process.cwd(), 'data', 'example', 'image')
    if (!fs.existsSync(this.imgpath)) {
      // 如果目录不存在，则创建它
      fs.mkdirSync(this.imgpath, {
        recursive: true
      })
    }
    this.image = fs.readdirSync(this.imgpath).filter(file => file.match('.(png|jpeg|gif|webp)')) || []
  }

  async init() {
    if (this.image.length === 0) {
      try {
        logger.warn('[心海表情包]数据包下载中...')
        await downloadAndExtractZip(url, 'data/example/image', data.proxy)
      } catch (error) {
        logger.info('下载出错')
        logger.info(error)
      }
    } else {
      logger.info('[心海表情包]数据包已存在，无需下载')
    }
    const response = await fetch(cosurl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36' }
    })
    const datalist = await response.json()
    for (let cost of datalist.data.list) {
      imageslist.push(cost.post.cover)
      if (cost.post.images) {
        for (let image of cost.post.images) {
          imageslist.push(image)
        }
      }
    }
    console.log('初始化图片数量', imageslist.length)

  }

  async dtpoke(e) {
    // 重新读取保证每次刷新
    data = yaml.parse(fs.readFileSync(sycfg, 'utf8'))
    if (!(data[e.group_id] || data).poke) return logger.info('[戳一戳]: 不可用')
    /*******
     * @description:
     * @param  e.target_id -目标qq
     * @return 判断被戳者是否为机器人
     */
    if (e.target_id === Cfg.qq) {
      let random_type = Math.random()
      if (random_type < 0.15) {
        await e.reply('奖励你一张图片，不准再戳了！！！')
        await common.sleep(500)
        let response = await fetch(xmimsge)
        const data = await response.json()
        const urldata = data.data[0].urls.original
        response = await fetch(urldata)
        let buffer = await response.arrayBuffer()
        let imsge = Buffer.from(buffer)
        const msg_id = await e.reply(segment.image(imsge))
        await common.sleep(60000) // 延迟一分钟
        /*******
         * @description:
         * @param group - 群聊事件
         * @param friend - 私聊事件
         * @return e 事件参数
         */
        if (e.isGroup) {
          await e.group.recallMsg(msg_id.message_id)
        } else {
          await e.friend.recallMsg(msg_id.message_id)
        }
        const image = imageslist[Math.floor(Math.random() * imageslist.length)]
        response = await fetch(image)
        buffer = await response.arrayBuffer()
        imsge = Buffer.from(buffer)
        await e.reply(segment.image(image))
      } else if (random_type < 0.35) {
        //随机回复文字
        await e.reply(txt_list[Math.floor(Math.random() * txt_list.length)])
      } else if (random_type < 0.46) {
        //反击
        await e.reply(poke_list[Math.floor(Math.random() * poke_list.length)])
        await common.sleep(1000)
        if (e.isGroup) {
          await e.group.pokeMember(e.operator_id)
        } else {
          await e.friend.pokeMember(e.operator_id)
        }
      } else {
        let mutetype = Math.ceil(Math.random() * 10)
        if (e.isGroup) {
          if (mutetype === 3) {
            await e.reply('说了不要戳了！')
            await common.sleep(1000)
            await e.group.muteMember(e.operator_id, 60)
            await common.sleep(3000)
            await e.reply('啧')
          } else if (mutetype === 6) {
            await e.reply('不！！')
            await common.sleep(500)
            await e.reply('准！！')
            await common.sleep(500)
            await e.reply('戳！！')
            await common.sleep(1000)
            await e.group.muteMember(e.operator_id, 30)
            await e.reply('让你面壁思过30秒，哼😤～')
          } else {
            //随机回复图片
            let impa = 'file:///' + this.imgpath + '/' + this.image[Math.floor(Math.random() * this.image.length)]
            await e.reply(segment.image(impa))
          }
        }
      }
    }
    return false
  }
}
/*******
 * @description:
 * @param {string} url - 下载zip链接
 * @param {string} outputPath - 解压缩后保存的路径
 *
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
    logger.info('[心海表情包]数据包下载完成')
  } catch (error) {
    if (error.message.includes('failed')) {
      console.error(`请检查链接是否可用:${url}`, '数据包下载失败')
    }
    console.error(error)
  }
}
