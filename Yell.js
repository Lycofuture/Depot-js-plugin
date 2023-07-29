/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:18:13
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:28:37
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
import _ from 'lodash'
let botName = '' //此处修改bot名字
//首发群:154687817，（有问题反馈可以来群中）
export class Yall extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '啊~啊~~啊~~~',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: `^#*${botName}(喊|叫).*$`,
          /** 执行方法 */
          fnc: 'hitokoto'
        }
      ]
    })
  }
  /**
   * #一言
   * @param e oicq传递的事件参数e
   */
  async hitokoto(e) {
    let reg = new RegExp(`^#*${botName}(喊|叫)(.*)$`)
    let msg = reg.exec(e.msg)[2]
    if (msg == '爸爸') {
      let arr = [
        [
          `讨厌..你才不是${botName}的爸爸呢..（嘟嘴）`,
          segment.image('https://i.imgtg.com/2023/02/16/dK1zb.jpg')
        ],
        [`才不要`, segment.image('https://i.imgtg.com/2023/02/16/dK7Jl.jpg')],
        [
          `${e.nickname}又不是${botName}的爸爸……`,
          segment.image('https://i.imgtg.com/2023/02/16/dKNlg.jpg')
        ],
        [`爸爸?`, segment.image('https://i.imgtg.com/2023/02/16/dKHcj.jpg')]
      ]
      e.reply(arr[_.random(0, arr.length - 1)])
    } else if (msg == '老公') {
      let arr = [
        [`诶……叫${botName}吗？`, segment.image('https://i.imgtg.com/2023/02/16/drPIC.jpg')],
        [
          `……老……老公……脸红//////哼，${e.nickname}好讨厌，${botName}不理${e.nickname}了。（扭头）`,
          segment.image('https://i.imgtg.com/2023/02/16/dKrTB.jpg')
        ],
        [
          `${botName}那么年轻才不要嫁人呢.`,
          segment.image('https://i.imgtg.com/2023/02/16/dKGNU.jpg')
        ],
        [
          `那${botName}叫${e.nickname}老公好不好>/////<`,
          segment.image('https://i.imgtg.com/2023/02/16/dKAZs.jpg')
        ],
        [`风太大${botName}听不清`, segment.image('https://i.imgtg.com/2023/02/16/dKQLY.jpg')],
        [
          `${e.nickname}干嘛叫的这么亲热呀?(? ???ω??? ?)?`,
          segment.image('https://i.imgtg.com/2023/02/16/dKKcK.jpg')
        ]
      ]
      e.reply(arr[Math.floor(Math.random() * arr.length)])
    } else if (msg == '主人') {
      let arr = [
        [
          `主人好`,
          segment.image(
            'https://gchat.qpic.cn/gchatpic_new/3264441674/693660587-3208196120-66AEC2F3B559B9ED0C58DDD424DDFE58/0?term=2&is_origin=0'
          )
        ],
        ['主……主人～(#／。＼#)', segment.image('https://i.imgtg.com/2023/02/16/drpeS.jpg')],
        [
          `奴隶${e.nickname}…（努力做出强势的样子）要把主人${botName}的鞋底舔干净哦，一点灰尘也不能剩下哦！`,
          segment.image('https://i.imgtg.com/2023/02/16/dKSuv.webp')
        ],
        [
          `${e.nickname}想让${botName}当${e.nickname}的主人吗？`,
          segment.image('https://i.imgtg.com/2023/02/16/drmoa.jpg')
        ]
      ]
      e.reply(arr[Math.floor(Math.random() * arr.length)])
    } else if (msg == '妈妈') {
      let arr = [
        [
          `那${botName}要当“妈妈”可以吗？`,
          segment.image('https://i.imgtg.com/2023/02/16/dKvOa.jpg')
        ],
        [
          `${e.nickname}又不是${botName}的妈妈……`,
          segment.image('https://i.imgtg.com/2023/02/16/dKy7S.jpg')
        ],
        [`妈妈!`, segment.image('https://i.imgtg.com/2023/02/16/dKgLN.jpg')],
        [`妈妈?`, segment.image('https://i.imgtg.com/2023/02/16/dKNlg.jpg')]
      ]
      e.reply(arr[Math.floor(Math.random() * arr.length)])
    } else {
      let arr = [
        [`${botName}不知道要怎么做……`, segment.image('https://i.imgtg.com/2023/02/16/dKmXC.jpg')],
        [`才不要`, segment.image('https://i.imgtg.com/2023/02/16/dK7Jl.jpg')],
        [`${msg}?`, segment.image('https://i.imgtg.com/2023/02/16/dKNlg.jpg')],
        [`${msg}!`, segment.image('https://i.imgtg.com/2023/02/16/dKgLN.jpg')],
        [
          `那样叫起来不会很尴尬么？${botName}歪着头这么说着`,
          segment.image('https://i.imgtg.com/2023/02/16/dK4Tt.jpg')
        ]
      ]
      e.reply(arr[_.random(0, arr.length - 1)])
    }
  }
}
