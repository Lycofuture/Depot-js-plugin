/**
 * @Author: Lycofuture
 * @Date: 2023-07-27 21:37:21
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 12:07:05
 */
/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:14:53
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 09:51:17
 * 添加防撤回开关控制，在bot根目录config/config/other.yaml里的 withdraw ，默认开启
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
import Cfg from '../../lib/config/config.js'
import moment from 'moment'
import fs from 'fs'
import yaml from 'yaml'
const pathToDir = `${process.cwd()}/data/message`
if (!fs.existsSync(pathToDir)) {
  // 如果目录不存在，则创建它
  fs.mkdirSync(pathToDir)
}
const pathDsf = `${pathToDir}/msg.json`
if (!fs.existsSync(pathDsf)) {
  // 如果文件不存在，则创建它并初始化值
  fs.writeFileSync(pathDsf, '[]')
}
const sycfg = './config/config/other.yaml'
const yamlContent = fs.readFileSync(sycfg, 'utf8')
const data = yaml.parse(yamlContent)
export class GroupNotification extends plugin {
  constructor() {
    super({
      name: '群通知',
      dsc: '群变动',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'notice.group',
      priority: 500
    })
  }
  init() {
    if (!data.withdraw) {
      data.withdraw = true
      // 将JavaScript对象转换为YAML字符串
      const newYamlString = yaml.stringify(data)
      // 将新的YAML字符串写回到文件中
      fs.writeFileSync(sycfg, newYamlString, 'utf-8')
    }
  }
  async accept(e) {
    let msg
    let forwardMsg
    switch (e.sub_type) {
      case 'increase': {
        if (e.user_id === Bot.uin) {
          msg = [
            `我是派蒙小助手\n大家快来欢迎我\n`,
            segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`)
          ]
        } else if (e.user_id !== Bot.uin) {
          msg = [
            segment.at(e.user_id),
            `欢迎新成员『${e.nickname}』(${e.user_id})加入本群\n`,
            `我是本群的小派蒙，你可以随时找我玩哦\n`,
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        }
        break
      }
      case 'decrease': {
        if (e.operator_id == e.user_id) {
          msg = [
            `用户『${e.member.card || e.member.nickname}』(${e.user_id})退出了本群\n`,
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        } else if (e.operator_id !== e.user_id) {
          msg = [
            `用户『${e.member.card || e.member.nickname}』(${e.user_id})被${e.operator_id
            }踢出了本群`,
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        }
        break
      }
      case 'admin': {
        e.set ? logger.mark('机器人被设置管理') : logger.mark('机器人被取消管理')
        if (e.user_id === Bot.uin) {
          msg = [
            e.set ? '[通知 - 机器人被设置管理]:\n' : '[通知 - 机器人被取消管理]:\n',
            segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`)
          ]
        } else {
          e.set ? logger.mark('新增群管理员') : logger.mark('取消群管理员')
          msg = [
            e.set
              ? `恭喜『${e.member.card || e.member.nickname}』(${e.user_id})被设置为管理员\n`
              : `『${e.member.card || e.member.nickname}』(${e.user_id})被取消了管理员身份`,
            segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`)
          ]
        }
        break
      }
      case 'recall': {
        // 是否为机器人撤回
        if (e.user_id === Bot.uin) return false
        // 是否为主人撤回
        if (Cfg.masterQQ.includes(Number(e.user_id))) return false
        // 是否开启
        if (data[e.group_id]?.withdraw === false) return false
        const res = await findJsonObject(JSON.parse(fs.readFileSync(pathDsf)), e.message_id)
        console.log(res)
        if (!res) return false
        let special = ''
        let msgType = {
          flash: {
            msg: () =>
              e.group.makeForwardMsg([
                {
                  message: segment.image(res[0].url),
                  nickname: e.group.pickMember(e.user_id).card,
                  user_id: e.user_id
                }
              ]),
            type: '[闪照]'
          },
          record: {
            msg: () => segment.record(res[0].file),
            type: '[语音]'
          },
          video: {
            msg: () => segment.video(res[0].file),
            type: '[视频]'
          },
          xml: {
            msg: () => res,
            type: '[合并消息]'
          }
        }
        if (msgType[res[0].type]) {
          forwardMsg = await msgType[res[0].type].msg()
          special = msgType[res[0].type].type
        } else {
          // 正常处理
          forwardMsg = await (e.bot ?? Bot).pickFriend(Cfg.masterQQ[0]).makeForwardMsg([
            {
              message: res,
              nickname: e.group.pickMember(e.user_id).card,
              user_id: e.user_id
            }
          ])
        }
        // 判断是否管理撤回
        let isManage = ''
        if (e.operator_id != e.user_id) {
          isManage = `撤回管理：${e.group.pickMember(e.operator_id).card}(${e.operator_id})\n`
        }
        isManage ? logger.mark('群聊管理撤回') : logger.mark('群聊撤回')
        // 发送的消息
        msg = [
          segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`),
          `${isManage ? '管理' : ''}${e.group.pickMember(e.user_id).card}(${e.user_id
          })撤回了一条消息\n`,
          //`${isManage ? '被撤回人' : '撤回人员'}：${e.group.pickMember(e.user_id).card}(${e.user_id})\n`,
          `撤回时间：${moment(e.time * 1000).format('MM-DD HH:mm:ss')}`,
          special ? `\n特殊消息：${special}` : ''
        ]
        break
      }
      default:
        return false
    }
    await e.reply(msg)
    if (forwardMsg) await e.reply(forwardMsg)
    return false
  }
}