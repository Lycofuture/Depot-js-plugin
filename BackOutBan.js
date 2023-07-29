/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:03:45
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 11:02:35
 */
import plugin from '../../lib/plugins/plugin.js'
export class newcomerplus  extends plugin {
  constructor() {
    super({
      name: '退群后检测踢人',
      dsc: '退群后检测踢人',
      event: 'notice.group.increase',
      priority: 4999
    })
  }
  /** 接受到消息都会执行一次 */
  async accept() {
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`
    let blackcomers = await redis.get(blackkey)
    const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {}
    if (blacks.indexOf(this.e.user_id) !== -1 && this.e.group.is_admin) {
      setTimeout(async () => {
        await this.e.group.kickMember(this.e.user_id)
      }, 500)
      await this.reply('本群已开启退群不允许再次进入。检测到你退出过该群，所以只好说再见！')
      return 'return'
    }
  }
}
export class outNoticeplus extends plugin {
  constructor() {
    super({
      name: '退群不在允许加入',
      dsc: '退群不在允许加入',
      event: 'notice.group.decrease',
      priority: 4999
    })
  }
  async accept() {
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`
    let blackcomers = await redis.get(blackkey)
    const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {}
    let blackcomersSet = new Set(blacks)
    blackcomersSet.add(this.e.user_id)
    await redis.set(
      blackkey,
      JSON.stringify({
        blacks: Array.from(blackcomersSet)
      })
    )
  }
}
export class idmanage extends plugin {
  constructor() {
    super({
      name: '管理退群黑名单',
      dsc: '管理退群黑名单',
      event: 'message.group',
      priority: 999,
      rule: [
        {
          reg: '^#退群黑名单列表',
          fnc: 'list',
          permission: 'master'
        },
        {
          reg: '^#退群黑名单添加.*',
          fnc: 'add',
          permission: 'master'
        },
        {
          reg: '^#退群黑名单删除.*',
          fnc: 'del',
          permission: 'master'
        },
        {
          reg: '^#退群黑名单清空',
          fnc: 'clear',
          permission: 'master'
        }
      ]
    })
  }
  async list() {
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`
    let blackcomers = await redis.get(blackkey)
    const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {}
    await this.reply(`退群黑名单列表：\n${blacks.join('\n')}`)
  }
  async del() {
    const user_id = this.e.msg.replace(/#退群黑名单删除/g, '').trim()
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`
    let blackcomers = await redis.get(blackkey)
    const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {}
    let blackcomersSet = new Set(blacks)
    const isOk = blackcomersSet.delete(Number(user_id))
    if (isOk) {
      await this.reply('删除退群黑名单成功')
      await redis.set(
        blackkey,
        JSON.stringify({
          blacks: Array.from(blackcomersSet)
        })
      )
    } else {
      await this.reply('未在退群黑名单中找到该QQ')
    }
  }
  async add() {
    const user_id = this.e.msg.replace(/#退群黑名单添加/g, '').trim()
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`
    let blackcomers = await redis.get(blackkey)
    const { blacks = [] } = blackcomers ? JSON.parse(blackcomers) : {}
    let blackcomersSet = new Set(blacks)
    blackcomersSet.add(Number(user_id))
    await this.reply('添加退群黑名单成功')
    await redis.set(
      blackkey,
      JSON.stringify({
        blacks: Array.from(blackcomersSet)
      })
    )
  }
  async clear() {
    let blackkey = `Yz:newblackcomers:${this.e.group_id}`
    await redis.del(blackkey)
    await this.reply('已清空退群黑名单')
  }
}
