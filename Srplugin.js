/**
 * @Author: Player_W
 * @Date: 2023-05-01 19:17:56
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 12:51:30
 * 由Player_W(976550854)大佬制作
 * 增加剩余回复
 * 修复时间戳
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
import fetch from 'node-fetch'
import gsCfg from '../genshin/model/gsCfg.js'
import lodash from 'lodash'
import md5 from 'md5'
export class Srplugin extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: 'Test',
      /** 功能描述 */
      dsc: '简单开发示例',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 5000,
      rule: [
        {
          /** 命令正则匹配 */
          reg: `^#?星铁统计$`,
          /** 执行方法 */
          fnc: 'srxq'
        },
        {
          /** 命令正则匹配 */
          reg: `^#?星铁体力$`,
          /** 执行方法 */
          fnc: 'srtl'
        }
      ]
    })
  }
  async srxq(e) {
    try {
      const getYaml = gsCfg.getBingCkSingle(e.user_id)
      const ck = lodash.map(getYaml, 'ck')
      const getUidOptions = {
        method: 'GET',
        headers: {
          'Host': 'api-takumi.mihoyo.com',
          'x-rpc-client_type': '5',
          'x-rpc-challenge': 'null',
          'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': 'application/json, text/plain, */*',
          'Origin': 'https://webstatic.mihoyo.com',
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.49.1',
          'Referer': 'https://webstatic.mihoyo.com/',
          'Connection': 'keep-alive',
          'Cookie': `${ck}`
        }
      }
      const getUid = await fetch(
        'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn',
        getUidOptions
      )
      const getUidCallBack = await getUid.json()
      const headers = {
        'Host': 'api-takumi.mihoyo.com',
        'Origin': 'https://webstatic.mihoyo.com',
        'Cookie': `${ck}`,
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'User-Agent':
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.49.1',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Referer': 'https://webstatic.mihoyo.com/',
        'Accept-Encoding': 'gzip, deflate, br'
      }
      const callback = await fetch(
        `https://api-takumi.mihoyo.com/event/srledger/month_info?uid=${getUidCallBack.data.list[0]['game_uid']}&region=${getUidCallBack.data.list[0]['region']}&month=`,
        {
          headers: headers,
          method: 'GET'
        }
      )
      const res = await callback.json()
      e.reply(
        `==============\n` +
        `UID：${getUidCallBack.data.list[0]['game_uid']}\n` +
        `==============\n` +
        `本日获取星琼：${res.data.day_data.current_hcoin}\n` +
        `本日获取星轨通票&星轨专票：${res.data.day_data.current_rails_pass}\n` +
        `==============\n` +
        `昨日获取星琼：${res.data.day_data.last_hcoin}\n` +
        `昨日获取星轨通票&星轨专票：${res.data.day_data.last_rails_pass}\n` +
        `==============\n` +
        `本月获取星琼：${res.data.month_data.current_hcoin}\n` +
        `本月获取星轨通票&星轨专票：${res.data.month_data.current_rails_pass}\n` +
        `==============\n` +
        `上月获取星琼：${res.data.month_data.last_hcoin}\n` +
        `上月获取星轨通票&星轨专票：${res.data.month_data.last_rails_pass}\n` +
        `==============\n` +
        `星琼收入组成：\n` +
        `${res.data.month_data.group_by[0]['action_name']}：${res.data.month_data.group_by[0]['percent']}%\n` +
        `${res.data.month_data.group_by[1]['action_name']}：${res.data.month_data.group_by[1]['percent']}%\n` +
        `${res.data.month_data.group_by[2]['action_name']}：${res.data.month_data.group_by[2]['percent']}%\n` +
        `${res.data.month_data.group_by[3]['action_name']}：${res.data.month_data.group_by[3]['percent']}%\n` +
        `${res.data.month_data.group_by[4]['action_name']}：${res.data.month_data.group_by[4]['percent']}%\n` +
        `${res.data.month_data.group_by[5]['action_name']}：${res.data.month_data.group_by[5]['percent']}%\n` +
        `${res.data.month_data.group_by[6]['action_name']}：${res.data.month_data.group_by[6]['percent']}%\n` +
        `==============`
      )
    } catch (error) {
      e.reply(
        `出现错误!可能的原因有:\n` +
        `1.ck失效或未绑定ck\n` +
        `2.当前ck未绑定星穹铁道角色\n` +
        `error:${error}`
      )
      console.log('[js插件]', error)
    }
    return false
  }
  async srtl(e) {
    try {
      let getYaml = gsCfg.getBingCkSingle(e.user_id)
      let ck = lodash.map(getYaml, 'ck')
      let getUidOptions = {
        method: 'GET',
        headers: {
          'Host': 'api-takumi.mihoyo.com',
          'x-rpc-client_type': '5',
          'x-rpc-challenge': 'null',
          'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept': 'application/json, text/plain, */*',
          'Origin': 'https://webstatic.mihoyo.com',
          'User-Agent':
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/2.49.1',
          'x-rpc-page': 'undefined',
          'x-rpc-app_version': '2.49.1',
          'Referer': 'https://webstatic.mihoyo.com/',
          'Connection': 'keep-alive',
          'Cookie': `${ck}`
        }
      }
      let getUid = await fetch(
        'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn',
        getUidOptions
      )
      let getUidCallBack = await getUid.json()
      const n = 'xV8v4Qu54lUKrEYFZkJhB8cuOh9Asafs'
      let t = Math.round(new Date().getTime() / 1000)
      let r = Math.floor(Math.random() * 900000 + 100000)
      let DS = md5(
        `salt=${n}&t=${t}&r=${r}&b=&q=role_id=${getUidCallBack.data.list[0]['game_uid']}&server=${getUidCallBack.data.list[0]['region']}`
      )
      let getNoteOptions = {
        method: 'GET',
        headers: {
          'x-rpc-app_version': '2.37.1',
          'x-rpc-client_type': 5,
          'User-Agent': `Mozilla/5.0 (Linux; Android 12; Yz-HDAONs) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.73 Mobile Safari/537.36 miHoYoBBS/2.37.1`,
          'Referer': 'https://webstatic.mihoyo.com',
          'DS': `${t},${r},${DS}`,
          'Cookie': `${ck}`
        }
      }
      let getNote = await fetch(
        `https://api-takumi-record.mihoyo.com/game_record/app/hkrpg/api/note?server=${getUidCallBack.data.list[0]['region']}&role_id=${getUidCallBack.data.list[0]['game_uid']}`,
        getNoteOptions
      )
      let getNoteCallBack = await getNote.json()
      const dateObj = new Date(getNoteCallBack.data.stamina_recover_time * 1000)
      const hours = dateObj.getUTCHours()
      const minutes = dateObj.getUTCMinutes()
      let sendMsg = [
        `==============\n` +
        `UID：${getUidCallBack.data.list[0]['game_uid']}\n` +
        `==============\n` +
        `当前开拓力:${getNoteCallBack.data.current_stamina}/${getNoteCallBack.data.max_stamina}\n` +
        `剩余回复时间${hours}小时${minutes}分钟\n` +
        `==============\n`
      ]
      for (let i = 0; i < getNoteCallBack.data.expeditions.length; i++) {
        const dateObj = new Date(getNoteCallBack.data.expeditions[i].remaining_time * 1000)
        const hours = dateObj.getUTCHours()
        const minutes = dateObj.getUTCMinutes()
        let translatedStatus = translateStatus(getNoteCallBack.data.expeditions[i].status)
        let msg = [
          `派遣${i + 1}「${getNoteCallBack.data.expeditions[i].name}」:${translatedStatus}\n` +
          `剩余时间:${hours}小时${minutes}分\n`
        ]
        sendMsg.push(msg)
        for (let j = 0; j < getNoteCallBack.data.expeditions[i].avatars.length; j++) {
          const imageurl = getNoteCallBack.data.expeditions[i].avatars[j]
          console.log(imageurl)
          sendMsg.push(segment.image(imageurl), '\n')
        }
        sendMsg.push(`==============\n`)
      }
      e.reply(sendMsg)
    } catch (error) {
      e.reply(`出现错误!可能的原因有:\n1.ck失效或未绑定ck\n2.当前ck未绑定星穹铁道角色`)
      e.reply(`error:${error}`)
      console.log('[js插件]', error)
    }
    function translateStatus(status) {
      if (status === 'Ongoing') {
        return '进行中'
      } else if (status === 'Finished') {
        return '已完成'
      } else {
        return status
      }
    }
    return false
  }
}
