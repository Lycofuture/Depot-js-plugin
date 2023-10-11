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
        await e.reply(segment.image(await render(url)))
    }

    /**
     *
     * @param e oicq传递的事件参数e
     */
    async baiduWeb(e) {
        let webkeywd = e.msg.replace(/#|百度/gm, '')
        webkeywd = webkeywd.replace(/[，,]/g, ',')
        let wdKey = webkeywd.split(',')
        wdKey = lodash.compact(wdKey)
        let keyWd = ''
        let searchKey = ''
        if (wdKey.length > 1) {
            searchKey = wdKey[0]
            keyWd = wdKey[1]
        }
        let weburl = `https://www.baidu.com/s?wd=${searchKey ? searchKey : webkeywd}`
        await e.reply(segment.image(await render(weburl, true, keyWd)))
    }
}

async function render(url, app = false, keyWd = '') {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--disable-gpu',
            '--disable-setuid-sandbox',
            '--no-sandbox',
            '--no-zygote'
        ],
        timeout: 0,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    }).catch(error => console.error(error))
    const page = await browser.newPage()
    await page.goto(url)
    if (app) {
        if (keyWd !== '列表') {
            try {
                let link = await page.evaluate(async keyWd => {
                    return [...document.querySelectorAll('.result a')]
                        .filter(item => {
                            return item.innerText && item.innerText.includes(keyWd)
                        })[0]
                        .toString()
                }, keyWd);
                if (link) {
                    link = link.toString();
                } else {
                    link = url;
                }
                await page.goto(link);
            } catch (error) {
                console.error('页面查找出错：', error);
            }
        } else {
            console.log('关键字不在列表中');
        }
    }
    const screenshotOptions = {
        type: 'jpeg', // 截图格式，默认为 png
        fullPage: true, // 是否截取整个页面，默认为 false
        omitBackground: true, // 是否移除背景颜色或图片，默认为 false
        quality: 100, // 设置 JPEG 图像的质量（0-200），默认是 80
        timeout: 90000, // 设置截图操作的超时时间为30秒
        waitUntil: 'networkidle2' // 等待页面中有2个或更少的网络连接处于活动状态
        // path: `${currentDir}/help${i+1}.jpeg`, //设置encoding后不可用
    }
    const Buffer = await page.screenshot(screenshotOptions)
    await browser.close()
    return Buffer
}
