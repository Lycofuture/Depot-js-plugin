/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:06:55
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:24:58
 */
import puppeteer from 'puppeteer'
import plugin from '../../lib/plugins/plugin.js'
import cfg from '../../lib/config/config.js'
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
const currentPath = fileURLToPath(new URL(import.meta.url))
// 获取当前模块所在的目录
const currentDir = path.dirname(currentPath)
let isHitokotoRunning = false
// 构建 plugins 目录的绝对路径 
const pluginsDir = path.join(currentDir, '..', '..', 'plugins');
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
    this.config = {
      headless: 'new',
      args: [
        '--disable-gpu', // 禁用GPU加速
        '--disable-dev-shm-usage', // 在使用/dev/shm时禁用特定的内存映射机制
        '--disable-setuid-sandbox', // 禁用setuid沙箱，在Linux中默认启用
        '--no-first-run', // 不展示第一次运行Chrome时的欢迎页面和设置向导
        '--no-sandbox', // 关闭沙盒模式，这意味着Chrome可以访问系统资源而不受限制，但也增加了安全风险
        '--no-zygote', // 禁用Chrome的zygote过程，zygote进程是一个轻量级的父进程，它用于创建子进程，以便在打开新标签页或窗口时快速加载Chrome
        '--single-process', // 强制Chrome只使用一个进程来运行所有的标签页和扩展程序，而不是为每个标签页和扩展程序都创建单独的进程
        '--disable-notifications', // 禁用桌面通知
        '--disable-background-networking', // 禁止Chrome在后台运行网络请求，可以减少内存占用和CPU负载
        '--disable-background-timer-throttling', // 禁止Chrome在后台降低定时器的精度，可以提高定时器的响应速度
        '--disable-backgrounding-occluded-windows', // 当Chrome窗口被遮挡时禁止在后台运行，可以减少系统资源的占用
        '--disable-breakpad', // 禁用Crash Reporting，可以减少内存占用和CPU负载
        '--disable-default-apps', // 禁用默认的应用程序，可以提高启动速度
        '--disable-extensions', // 禁用所有扩展程序，可以减少内存占用和CPU负载
        '--disable-infobars', // 隐藏Chrome正在被自动化控制的提示信息，可以提高用户体验
        '--disable-popup-blocking', // 禁用弹出窗口阻止功能，可以提高性能
        '--disable-translate', // 禁用翻译功能，可以减少内存占用和CPU负载
        '--metrics-recording-only', // 只记录指标数据，不发送到Google服务器，可以减少网络负载
        '--disable-client-side-phishing-detection', // 禁用客户端钓鱼检测功能，可以减少内存占用和 CPU 负载。
        '--disable-features=site-per-process', // 为每个站点进程启用单独的进程，可以提高稳定性和安全性。
        '--disable-hang-monitor', // 禁用 hang 监控器，可以减少内存占用和 CPU 负载。
        '--disable-prompt-on-repost', // 禁用重复提交的提示功能，可以提高用户体验。
        '--disable-sync', // 禁用 Chrome 同步功能，可以减少内存占用和 CPU 负载。
        '--force-color-profile=srgb', // 强制使用 sRGB 颜色空间，可以提高颜色的一致性和可靠性。
        '--hide-scrollbars', // 隐藏滚动条，可以提高页面的美观性和可读性。
        '--ignore-certificate-errors', // 忽略证书错误，可以方便在测试和开发环境中使用 HTTPS。
        '--mute-audio', // 禁用音频播放，可以提高性能。
        '--no-default-browser-check', // 不检查是否为默认浏览器，可以提高启动速度。
        '--use-gl=swiftshader', // 使用 SwiftShader 软件渲染器，可以提高性能。
        '--window-size=1920,1080', // 设置窗口大小为 1920x1080。
        '--disable-gpu-sandbox', // 禁用 GPU 沙箱，可以提高性能。
        '--disable-ipc-flooding-protection', // 禁用 IPC 流量保护功能，可以提高性能。
        '--disable-renderer-backgrounding', // 禁止正在运行的页面在后台绘制，可以减少内存占用和 CPU 负载。
        '--disk-cache-dir=/dev/null', // 将磁盘缓存目录设置为空，可以避免磁盘缓存造成的安全风险。
        '--disable-renderer-throttling', // 禁止 Chrome 在后台降低渲染进程的优先级，可以提高绘图性能。
        '--enable-automation', // 启用自动化控制功能，可以方便进行自动化测试。
        '--ignore-certificate-errors-spki-list', // 忽略由指定的公钥引起的证书错误。
        '--no-experiments', // 禁用实验性的功能和特性，可以提高稳定性和安全性。
        '--no-pings', // 禁用所有 ping 请求，可以提高隐私性和安全性。
        '--no-proxy-server', // 不使用代理服务器，可以提高网络连接的速度和稳定性。
        '--num-raster-threads=4', // 设置渲染线程的数量为 4，可以提高渲染性能。
        '--disable-web-security' // 禁用所有 Web 安全功能，可以在测试和开发环境中方便地进行跨域访问等操作。
      ],
      ignoreHTTPSErrors: true, // 忽略HTTPS错误，可以加快页面加载速度
      slowMo: 1000 //降低 Puppeteer 操作的速度，以便更容易看到发生了什么。默认为 0，表示不降低操作速度。如果将其设置为一个大于 0 的整数，则会将每个 Puppeteer 操作之间的延迟增加相应的毫秒数。
    }
  }
  async helpall(e) {
    if (isHitokotoRunning) {
      await e.reply('获取指令正在执行，请稍后再试')
      return
    }
    await e.reply('正在获取指令中请稍后...')
    if (cfg.bot.chromium_path) {
      /** chromium其他路径 */
      this.config.executablePath = cfg.bot.chromium_path
    }
    isHitokotoRunning = true
    try {
      logger.info('puppeteer Chromium 启动中...')
      const browser = await puppeteer.launch(this.config)
      if (!browser) {
        logger.error('puppeteer Chromium 启动失败')
        return true
      }
      logger.info('puppeteer Chromium 启动成功')
      const results = []
      await traverseDirectories(pluginsDir, filePath =>
        readJavaScriptFile(filePath, results)
      )
      logger.info('获取完毕')
      const cleanedResults = results.map(reg =>
        reg
          .toString()
          .slice(1, -1)
          .replace(/[\^$'"`]/g, ''))
      const listns = cleanedResults.map((result, index) => `${index + 1}. ${result}\n==============\n`);
      logger.info(await e.reply(`==============\n${listns.join('')}`))
      let imagelist = []
      for (let i = 0; i < cleanedResults.length; i += 100) {
        let helpResults = cleanedResults.slice(i, i + 100)
        const html = `<!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                /* 背景图 */
                background: url('http://photonj.photo.store.qq.com/psc?/V11I51F91RAxH4/ruAMsa53pVQWN7FLK88i5jDDEwtN9iFmVjQpEMeFZwr6JIoCdBDivHG3YX2DVkLNuS9uevCsBl20XqQparoGnaKLU2oXrsEpUkaTVIsws.M!/b&bo=3AVKCNwFSggBCS4!&rf=viewer_4');
                background-repeat: no-repeat;
                background-size: cover;
              }
              .head-box {
                margin: 15px 0 0 0;
                padding-bottom: 0;
              }
              .head-box .title {
                font-size: 50px;
                text-align: center;
              }
              .cont-box {
                position: relative;
                padding-bottom: 50px;
              }
              .help-group {
                /* 设置圆角边框半径为15像素 */
                border-radius: 15px;
                /* 上边距为20像素 */
                margin-top: 20px;
                /* 下边距为20像素 */
                margin-bottom: 20px;
                /* 对于超出边界的内容进行隐藏 */
                overflow: hidden;
                /* 添加阴影效果 */
                box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.15);
                /* 相对定位 */
                position: relative;
                /* 对背景进行模糊处理，模糊程度为5像素 */
                backdrop-filter: blur(5px);
                /*  相对于正常位置向上移动10像素 */
                top: -10px;
                font-size: 25px;
                font-weight: bold;
                padding: 15px 15px 10px 20px;
              }
              .bottom-box {
                position: relative;
                bottom: 0;
                font-size: 25px;
                /* 字体加粗 */
                font-weight: bold;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="head-box">
              <div class="title">动态获取指令列表</div>
            </div>
            <div class="cont-box">
              ${helpResults.map(result => `
              <div class="help-group">${result}</div>
              ` ).join('')}
            </div>
            <div class="bottom-box">Yunzai-Bot & Depot-js-plugin</div>
          </body>
        </html>
        `
        logger.info(`[图片生成] 图片渲染中...`)
        const page = await browser.newPage()
        await page.setContent(html)
        // 设置截图选项
        const screenshotOptions = {
          type: 'jpeg', // 截图格式，默认为 png
          fullPage: true, // 是否截取整个页面，默认为 false
          omitBackground: true, // 是否移除背景颜色或图片，默认为 false
          quality: 100, // 设置 JPEG 图像的质量（0-200），默认是 80
          encoding: 'base64', // 图像的编码方式，例如 base64。
          timeout: 30000, // 设置截图操作的超时时间为30秒
          waitUntil: 'networkidle2' // 等待页面中有2个或更少的网络连接处于活动状态
          // path: `${currentDir}/help${i+1}.jpeg`, //设置encoding后不可用
        }
        try {
          const image = await page.screenshot(screenshotOptions)
          const buffer = Buffer.from(image, 'base64')
          logger.info(`[图片生成] 图片渲染成功`)
          imagelist.push(segment.image(buffer))
        } catch (error) {
          logger.error('[图片生成] 图片渲染出现错误！')
          logger.error(error)
        }
        await common.sleep(1000)
      }
      logger.info('Chromium 已关闭')
      await browser.close()
      const nummag = common.makeForwardMsg(e, imagelist)
      await e.reply(nummag)
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
      console.log(filePath); // 输出子目录路径
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
