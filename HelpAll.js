/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:06:55
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-08 11:06:33
 */
import puppeteer from '../../lib/puppeteer/puppeteer.js'
import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import fs from 'fs'
import { fileURLToPath } from 'url';
import path from 'path'
if (!global.segment) {
  try {
    global.segment = (await import('icqq')).segment
  } catch {
    try {
      global.segment = (await import('oicq')).segment
    } catch { }
  }
}
// 背景图
const url = 'http://photonj.photo.store.qq.com/psc?/V11I51F91RAxH4/ruAMsa53pVQWN7FLK88i5jDDEwtN9iFmVjQpEMeFZwr6JIoCdBDivHG3YX2DVkLNuS9uevCsBl20XqQparoGnaKLU2oXrsEpUkaTVIsws.M!/b&bo=3AVKCNwFSggBCS4!&rf=viewer_4'
const currentPath = fileURLToPath(new URL(import.meta.url))
// 获取当前模块所在的目录
const currentDir = path.dirname(currentPath)
let isHitokotoRunning = false
// 构建 plugins 目录的绝对路径 
const pluginsDir = path.join(currentDir, '..', '..', 'plugins');
const file = `${process.cwd()}/resources`
export class HelpAll extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '获取全部指令',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1,
      rule: [
        {
          reg: `^#?helpro$`,
          fnc: 'helpall'
        }
      ]
    })
  }
  async helpall(e) {
    if (!fs.existsSync(`${file}/example/helpall.html`)) html()
    if (isHitokotoRunning) {
      await e.reply('获取指令正在执行，请稍后再试')
      return false
    }
    await e.reply('正在获取指令中请稍后...')
    isHitokotoRunning = true
    try {
      const results = [], buff = []
      await traverseDirectories(pluginsDir, filePath =>
        readJavaScriptFile(filePath, results)
      )
      logger.info('获取完毕')
      const cleanedResults = results.map(reg =>
        reg
          .toString()
          .slice(1, -1)
          .replace(/[\^$'"`]/g, ''))
      for (let i = 0; i < cleanedResults.length; i += 20) {
        const nummag = cleanedResults.slice(i, i + 20)
        const data = {
          bake: url,
          helpResults: nummag,
          saveId: 'example',
          _plugin: 'helpall',
          tplFile: './resources/example/helpall.html',
        }
        const imagelist = await puppeteer.screenshot(`example/helpall`, data)
        buff.push(imagelist)
      }
      let nummag = await common.makeForwardMsg(e, buff)
      let Msg = await e.reply(nummag)
      if (!Msg) {
        const listns = `==============\n${(cleanedResults.map((result, index) => `${index + 1}. ${result}\n==============\n`)).join('')}`
        nummag = common.makeForwardMsg(e, listns)
        await e.reply(nummag)
      }
    } finally {
      isHitokotoRunning = false
    }
    return false
  }
}
// 异步函数：读取目录，不包括符号链接
async function readdirNoSymlink(directory) {
  return new Promise((resolve, reject) => {
    // 使用fs.readdir读取目录下的文件和子目录，并指定withFileTypes选项来获取详细信息
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
      if (err) {
        reject(err); // 如果出现错误，返回一个rejected状态的Promise
      } else {
        // 过滤掉符号链接，并只保留文件名
        resolve(files.filter((file) => !file.isSymbolicLink()).map((file) => file.name));
      }
    });
  });
}
// 异步函数：遍历目录及其子目录，并执行回调函数
async function traverseDirectories(directory, callback) {
  // 使用readdirNoSymlink函数读取目录内容
  const files = await readdirNoSymlink(directory)
  // 遍历文件和子目录
  for (const file of files) {
    const filePath = path.join(directory, file); // 构建文件的完整路径
    const stats = fs.statSync(filePath); // 获取文件的状态信息
    if (stats.isDirectory() && !stats.isSymbolicLink()) {
      // 如果是子目录且不是符号链接，则递归调用traverseDirectories函数遍历子目录
      // console.log(filePath); // 输出子目录路径
      await traverseDirectories(filePath, callback);
    } else {
      // 如果是文件，则执行回调函数
      await callback(filePath);
    }
  }
}// 异步函数：读取JavaScript文件并提取正则表达式匹配的内容
async function readJavaScriptFile(filePath, results) {
  if (path.extname(filePath) === '.js') { // 检查文件扩展名是否为.js
    const data = await fs.promises.readFile(filePath, { encoding: 'utf8' }); // 定义匹配正则表达式的模式
    const regex = /reg: (.*?),/g; // 定义匹配正则表达式的模式
    let match;
    while ((match = regex.exec(data)) !== null) {
      // 循环匹配正则表达式，并将匹配结果添加到results数组中
      results.push(match[1]);
    }
  }
}
function html() {
  if (!fs.existsSync(file + "/example")) fs.mkdirSync(file + "/example")

  const html = `
  <!DOCTYPE html>
<html>

<head>
    <style>
        @font-face {
            font-family: "tttgbnumber";
            src: url("../../resources/font/HYWenHei-55W.ttf");
            font-weight: normal;
            font-style: normal;
        }

        body {
            /* 背景图 */
            background: url({{bake}});
            font-family: sans-serif;
            font-size: 16px;
            width: 530px;
            color: #1e1f20;
            transform: scale(1.5);
            transform-origin: 0 0;
        }

        .head-box {
            border-radius: 15px;
            font-family: tttgbnumber;
            padding: 10px 20px;
            position: relative;
        }

        .head-box .title {
            font-size: 50px;
            text-align: center;
        }

        .cont-box {
            /* 添加阴影效果 */
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15);
        }

        .help-group {
            /* 设置圆角边框半径为15像素 */
            border-radius: 15px;
            /* 上边距为10像素 */
            margin-top: 10px;
            /* 下边距为10像素 */
            margin-bottom: 10px;
            /* 左边缩短10像素 */
            margin-left: 10px;
            /* 右边距缩短10像素 */
            margin-right: 10px;
            /* 对于超出边界的内容进行隐藏 */
            overflow: hidden;
            /* 相对定位 */
            position: relative;
            /* 对背景进行模糊处理，模糊程度为5像素 */
            /* backdrop-filter: blur(5px); */
            /* 字体大小15像素 */
            font-size: 15px;
            /* 字体加粗 */
            /* font-weight: bold; */
            /*  内边距（padding）为 15 像素顶部、15 像素右侧、10 像素底部、20 像素左侧。 */
            padding: 15px 15px 10px 20px;
            /* 添加阴影效果 */
            box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.30);
        }

        .bottom-box {
            font-size: 14px;
            font-family: "tttgbnumber";
            text-align: center;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;
            background-image: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
        }
    </style>
</head>

<body>
    <div class="head-box">
        <div class="title">动态获取指令列表</div>
        <div class="cont-box">
            {{each helpResults time}}
            <div class="help-group">{{time}}</div>
            {{/each}}
        </div>
        <div class="bottom-box">Yunzai-Bot & Depot-js-plugin</div>
    </div>
</body>

</html>
`
  if (!fs.existsSync(file + "/example/helpall.html")) fs.writeFileSync(file + "/example/helpall.html", html)
  if (!fs.existsSync(`${process.cwd()}/data/html/example/helpall`)) fs.mkdirSync(`${process.cwd()}/data/html/example/helpall`, { recursive: true })
}