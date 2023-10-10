/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:14:18
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-09 21:11:00
 */
import lodash from 'lodash'
import puppeteer from 'puppeteer'
export class WebPreview extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '截图预览网页内容',
      /** 功能描述 */
      dsc: '群里发送网页地址，截图预览网页内容',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1006,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '^(?:(http|https)://)?((?:[\\w-]+\\.)+[a-z0-9]+)((?:/[^/?#]*)+)?(\\?[^#]+)?(#.+)?$',
          /** 执行方法 */
          fnc: 'webPreview'
        },
        {
          /** 命令正则匹配 */
          reg: '^#*百度(.*)$',
          /** 执行方法 */
          fnc: 'baiduWeb'
        }
      ]
    })
  }
  /**
   *
   * @param e oicq传递的事件参数e
   */
  async webPreview(e) {
     let url = e.msg
        if (!url.match(/^(https|http):\/\//)) {
            url = 'https://' + url
        }
        console.log('预览地址:', url)
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process'
            ]
        })
        const page = await browser.newPage()
        await page.goto(url)
        await page.setViewport({
            width: 1920,
            height: 1080
        })
        const Buffer = await page.screenshot({fullPage: true})
        await e.reply(segment.image(Buffer))
        await browser.close()
  }
  /**
   *
   * @param e oicq传递的事件参数e
   */
  async baiduWeb(e) {
    let webkeywd = e.msg.replace(/#|百度/gm, '')
    webkeywd = webkeywd.replace(/，| |,/g, ',')
    let wdKey = webkeywd.split(',')
    wdKey = lodash.compact(wdKey)
    let keyWd = ''
    let searchKey = ''
    if (wdKey.length > 1) {
      searchKey = wdKey[0]
      keyWd = wdKey[1]
    }
    console.log('keyWd', keyWd)
    let weburl = `https://www.baidu.com/s?wd=${searchKey ? searchKey : webkeywd}`
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-first-run',
        '--no-sandbox',
        '--no-zygote',
        '--single-process'
      ]
    })
    const page = await browser.newPage()
    await page.goto(weburl)
    await page.setViewport({
      width: 1920,
      height: 1080
    })
    if (keyWd != '列表') {
      let link = await page.evaluate(async keyWd => {
        return [...document.querySelectorAll('.result a')]
          .filter(item => {
            return item.innerText && item.innerText.includes(keyWd)
          })[0]
          .toString()
      }, keyWd)
      if (link) {
        // console.log("找到");
        link = link.toString()
      } else {
        // console.log("没找到");
        link = weburl
      }
      console.log(link)
      await page.goto(link)
    }
    await this.reply(
      segment.image(
        await page.screenshot({
          fullPage: true
        })
      )
    )
    await browser.close()
  }
}
