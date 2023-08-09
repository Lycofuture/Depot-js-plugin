/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:14:53
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-10 06:57:51
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
let data = yaml.parse(fs.readFileSync(sycfg, 'utf8'))
if (!data.withdraw) {
  data.withdraw = true
  // 将JavaScript对象转换为YAML字符串
  const newYamlString = yaml.stringify(data)
  // 将新的YAML字符串写回到文件中
  fs.writeFileSync(sycfg, newYamlString, 'utf-8')
}
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
  async accept(e) {
    let msg, forwardMsg
    const oper = await e.group.pickMember(e.operator_id)
    switch (e.sub_type) {
      case 'increase': {
        if (e.user_id === Bot.uin) {
          msg = [
            `我是派蒙小助手\n大家快来欢迎我\n`,
            segment.image(`https://p.qlogo.cn/gh/${e.group_id}/${e.group_id}/100`)
          ]
        } else {
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
        if (e.operator_id === e.user_id) {
          msg = [
            `用户『${e.member?.card || e.member.nickname}』(${e.user_id})退出了本群\n`,
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        } else if (e.operator_id !== e.user_id) {
          msg = [
            `用户『${e.member?.card || e.member.nickname}』(${e.user_id})被『${oper.card || oper.nickname}』(${e.operator_id
            })`,
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        }
        break
      }
      case 'admin': {
        if (e.user_id === Bot.uin) {
          e.set ? logger.mark('机器人被设置管理') : logger.mark('机器人被取消管理')
          msg = [
            e.set ? '[通知 - 机器人被设置管理]:\n' : '[通知 - 机器人被取消管理]:\n',
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        } else {
          e.set ? logger.mark('新增群管理员') : logger.mark('取消群管理员')
          msg = [
            e.set
              ? `恭喜『${e.member?.card || e.member.nickname}』(${e.user_id})被设置为管理员\n`
              : `『${e.member?.card || e.member.nickname}』(${e.user_id})被取消了管理员身份\n`,
            segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`)
          ]
        }
        break
      }
      case 'recall': {
        // 重新读取保证每次刷新
        data = yaml.parse(fs.readFileSync(sycfg, 'utf8'))
        // 是否为机器人撤回
        if (e.user_id === Bot.uin) return false
        // 是否为主人撤回
        if (Cfg.masterQQ.includes(e.user_id)) return false
        // 是否开启
        if (!(data[e.group_id] || data).withdraw) return false
        const res = await findJsonObject(JSON.parse(fs.readFileSync(pathDsf, 'utf8')), e.message_id)
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
          },
          json: {
            msg: () => res,
            type: '[合并消息]'
          }
        }
        if (msgType[res[0].type]) {
          forwardMsg = await msgType[res[0].type].msg()
          special = msgType[res[0].type].type
        } else {
          // 正常处理
          forwardMsg = await Bot.pickFriend(Number(Cfg.masterQQ[0])).makeForwardMsg([
            {
              message: res,
              nickname: e.group.pickMember(e.user_id).card,
              user_id: e.user_id
            }
          ])
        }
        // 判断是否管理撤回
        let isManage = ''
        if (e.operator_id !== e.user_id) {
          isManage = `管理『${e.group.pickMember(e.operator_id).card}』(${e.operator_id})撤回了『${e.group.pickMember(e.user_id).card}』(${e.user_id})的一条消息\n`
        }
        isManage ? logger.mark(`管理撤回`) : logger.mark('群员撤回')
        // 发送的消息
        msg = [
          segment.image(`http://q.qlogo.cn/headimg_dl?dst_uin=${e.user_id}&spec=640&img_type=jpg`),
          `${isManage ? isManage : `${e.group.pickMember(e.user_id).card}(${e.user_id})撤回了一条消息`}`,
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
/**
 * 在给定的数组中查找包含目标值的 JSON 对象。
 * @param {Array} arr - 要搜索的数组。
 * @param {string} targetValue - 目标值。
 * @returns {Object|null} - 找到的 JSON 对象（如果存在），否则返回 null。
 */
async function findJsonObject(arr, targetValue) {
  for (const obj of arr) {
    for (const value of Object.values(obj)) {
      if (typeof value === 'string' && value.includes(targetValue)) {
        const jsonStr = value.substring(value.indexOf('['));
        return JSON.parse(jsonStr);
      }
    }
  }
  return null;
}

