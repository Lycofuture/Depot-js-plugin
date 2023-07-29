/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 17:12:07
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-28 20:31:43
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
import fs from 'node:fs'
const _path = `./soufanvideo/`
//项目路径
const _cwdpath = process.cwd()
if (!fs.existsSync(_path)) {
  fs.mkdirSync(_path)
}
let minsim = 0.9 //#匹配度，0.90以下的可能会不太准
export class SouFanDrama extends plugin {
  constructor() {
    super({
      /** 功能名称 */
      name: '搜番剧',
      /** 功能描述 */
      dsc: '通过番剧截图搜索番名及信息',
      /** https://oicqjs.github.io/oicq/#events */
      event: 'message',
      /** 优先级，数字越小等级越高 */
      priority: 1001,
      rule: [
        {
          /** 命令正则匹配 */
          reg: '#*搜番$',
          /** 执行方法 */
          fnc: 'fjsearch'
        }
      ]
    })
  }
  /**
   *
   * @param e oicq传递的事件参数e
   */
  async fjsearch(e) {
    if (this.e.source) {
      let reply
      if (this.e.isGroup) {
        reply = (await this.e.group.getChatHistory(this.e.source.seq, 1)).pop()?.message
      } else {
        reply = (await this.e.friend.getChatHistory(this.e.source.time, 1)).pop()?.message
      }
      if (reply) {
        for (let val of reply) {
          if (val.type == 'image') {
            this.e.img = [val.url]
            break
          }
        }
      }
    }
    if (!this.e.img) {
      this.setContext('dealImg')
      await this.reply(' 请发送动漫番剧截图', false, {
        at: true
      })
    } else {
      this.dealImg()
    }
  }
  async dealImg() {
    if (!this.e.img) {
      return true
    }
    let responseImage = await fetch(this.e.img[0])
    if (!responseImage.ok) {
      await this.reply('获取番剧图片失败', false, {
        at: true
      })
    }
    let buffer = await responseImage.arrayBuffer()
    let headers = {
      'Content-Type': 'image/jpeg'
    }
    let file = Buffer.from(buffer, 'binary')
    let urlapi = 'https://api.trace.moe/search?anilistInfo=&cutBorders='
    let response = await fetch(urlapi, {
      method: 'POST',
      body: file,
      headers
    })
    let res = await response.json()
    if (res.result.length == 0) {
      await this.reply(
        '未找到相关番剧，此搜索引擎对截图尺寸和质量要求比较高，不支持以下类型截图识别：\n1、有额外添加的黑边\n2、裁切过的不完整截图\n3、左右翻转的\n4、经过滤镜处理的\n5、加了文字的表情包\n6、1990年之前的动画\n7、非正式发行的动画，即同人插图等\n8、非日本动画\n9、画面过暗的\n10、分辨率过低的（须大于 320x180）'
      )
      this.finish('dealImg')
      return true
    }
    let resultall = res.result[0]
    let formtime = resultall.from
    if (resultall.similarity.toFixed(4) < minsim) {
      await this.reply(
        '未找到相关番剧，此搜索引擎对截图尺寸和质量要求比较高，不支持以下类型截图识别：\n1、有额外添加的黑边\n2、裁切过的不完整截图\n3、左右翻转的\n4、经过滤镜处理的\n5、加了文字的表情包\n6、1990年之前的动画\n7、非正式发行的动画，即同人插图等\n8、非日本动画\n9、画面过暗的\n10、分辨率过低的（须大于 320x180）'
      )
      this.finish('dealImg')
      return true
    }
    let synonyms = ''
    for (const key in resultall.anilist.synonyms) {
      synonyms += resultall.anilist.synonyms[key] + '、'
    }
    let details = await this.getDetails(resultall.anilist.id)
    let end = ''
    if (details.status != 'FINISHED') {
      end = '未完结'
    } else {
      end = details.endDate.year + '年' + details.endDate.month + '月' + details.endDate.day + '日'
    }
    let fengmian
    if (!resultall.anilist.isAdult) {
      fengmian = details.coverImage.large
    }
    let msg = [
      fengmian ? segment.image(fengmian) : '',
      '\n番名：' + resultall.anilist.title.native + '\n',
      resultall.anilist.title.romaji + '\n',
      '别名：' + synonyms + '\n',
      `类型：${details.type} - ${details.format}` + `  共${details.episodes}集\n`,
      '开播时间：' +
      details.startDate.year +
      '年' +
      details.startDate.month +
      '月' +
      details.startDate.day +
      '日 - ' +
      end +
      '\n',
      '相似度：' + resultall.similarity.toFixed(4) * 100 + '%\n',
      '该截图出自第' +
      resultall.episode +
      '集' +
      Math.floor((formtime % 3600) / 60) +
      '分' +
      Math.floor(formtime % 60) +
      '秒'
    ]
    await this.e.reply(msg)
    if (!resultall.video) {
      return true
    }
    console.log(_cwdpath)
    let url = resultall.video
    response = await fetch(url)
    let buff = await response.arrayBuffer()
    var me = this
    fs.writeFile(`${_path}temp.mp4`, Buffer.from(buff), 'binary', async function (err) {
      console.log(err || '下载视频成功')
      if (!err) {
        if (!resultall.anilist.isAdult) {
          await me.e.reply(
            segment.video(`file:///${_cwdpath}/plugins/suiyue/resources/soufanvideo/temp.mp4`)
          )
        }
      }
    })
    this.finish('dealImg')
  }
  async getDetails(id) {
    let query = `{Media (id:${id}) {coverImage {large}startDate {year,month,day}endDate {year,month,day}season,seasonYear,type,format,status,episodes}}`
    let url = 'https://graphql.anilist.co'
    let response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    })
    let res = await response.json()
    return res.data.Media
  }
}
