/**
 * @Author: Lycofuture
 * @Date: 2023-07-22 19:26:05
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:25:31
 */
// const cosurl = 'https://bbs-api.mihoyo.com/post/wapi/getForumPostList?forum_id=47'
const cosurl = 'https://bbs-api.miyoushe.com/post/wapi/getForumPostList?forum_id=49&gids=2&is_good=false&is_hot=true&page_size=20&last_id=0'
if (!global.segment) {
    try {
        global.segment = (await import('icqq')).segment
    } catch {
        try {
            global.segment = (await import('oicq')).segment
        } catch { }
    }
}
const imageslist = []
import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'
import fetch from 'node-fetch'
export class Myscos extends plugin {
    constructor() {
        super({
            /** 功能名称 */
            name: 'cos',
            /** 功能描述 */
            dsc: '简单开发示例',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message',
            /** 优先级，数字越小等级越高 */
            priority: 5000,
            rule: [
                {
                    /** 命令正则匹配 */
                    reg: `^#?今日cos$`,
                    /** 执行方法 */
                    fnc: 'cospq'
                }
            ]
        })
    }
    async cospq(e) {
        const response = await fetch(cosurl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36' }
        })
        const datalist = await response.json()
        for (let cost of datalist.data.list) {
            const response = await fetch(cost.post.cover)
            const buffer = await response.arrayBuffer()
            const data = Buffer.from(buffer)
            imageslist.push(segment.image(data))
            if (cost.post.images) {
                for (let image of cost.post.images) {
                    const response = await fetch(image)
                    const buffer = await response.arrayBuffer()
                    const data = Buffer.from(buffer)
                    imageslist.push(segment.image(data))
                }
            }
        }
        const imagearr = await common.makeForwardMsg(e, imageslist)
        await e.reply(imagearr)
    }
}
