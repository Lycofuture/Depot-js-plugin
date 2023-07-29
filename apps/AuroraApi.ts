/*
 * @Author: Lycofuture
 * @Date: 2023-06-30 17:09:45
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 13:40:20
 */
import { plugin, Messagetype, segment } from 'alemon'
const url = 'https://api.andeer.top/API/'
export class AuroraApi extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^\/?精选一言/,
          fnc: 'Aurora_comment'
        },
        {
          reg: /^\/?报喜(.*)/,
          fnc: 'xibao'
        },
        {
          reg: /^\/?疯狂星期四/,
          fnc: 'kfc'
        },
        {
          reg: /^\/?答案之书/,
          fnc: 'answer'
        },
        {
          reg: /^\/?早报/,
          fnc: 'value'
        },
        {
          reg: /^\/?每日文/,
          fnc: 'article'
        },
        {
          reg: /^\/?(早安|晚安)/,
          fnc: 'word_pic'
        },
        {
          reg: /^\/?随机图/,
          fnc: 'beauty'
        }
      ]
    })
  }
  async Aurora_comment(e: Messagetype): Promise<boolean> {
    console.log('[Aurora_comment]', '任务触发')
    await e.reply(await imageurl(`${url}Aurora_comment.php`))
    return false
  }
  async xibao(e: Messagetype): Promise<boolean> {
    console.log('[xibao]', '任务触发')
    const msg = e.cmd_msg.replace(/^\/?报喜/, '')
    console.log(msg)
    if (!msg) {
      await e.reply('请输入喜报需要展示的内容')
    } else {
      await e.reply(await imageurl(`${url}img_xibao.php?data=${msg}`))
    }
    return false
  }
  async kfc(e: Messagetype): Promise<boolean> {
    console.log('[kfc]', '任务触发')
    const apidata = await fetchData(`${url}kfc.php`)
    await e.reply(apidata.data)
    return false
  }
  async answer(e: Messagetype): Promise<boolean> {
    console.log('[answer]', '任务触发')
    const apidata = await fetchData(`${url}answer.php`)
    await e.reply(apidata.data.zh)
    return false
  }
  async value(e: Messagetype): Promise<boolean> {
    console.log('[value]', '任务触发')
    await e.reply(await imageurl(`${url}60s.php`))
    return false
  }
  async article(e: Messagetype): Promise<boolean> {
    console.log('[article]', '任务触发')
    const apidata = await fetchData(`${url}article.php`)
    await e.reply(apidata.data.content)
    return false
  }
  async word_pic(e: Messagetype): Promise<boolean> {
    console.log('[word_pic]', '任务触发')
    await e.reply(await imageurl(`${url}word_pic.php`))
    return false
  }
  async beauty(e: Messagetype): Promise<boolean> {
    console.log('[beauty]', '任务触发')
    const apidata = await fetchData(`${url}beauty1.php`)
    await e.reply(await imageurl(apidata.data))
    return false
  }
}

/**
 * @description:
 * @param {string}  url - 返回json或text
 * @return {*}
 */
async function fetchData(url: string): Promise<any> {
  let data: any
  const response = await fetch(url)
  try {
    data = await response.json()
  } catch {
    try {
      data = await response.text()
    } catch (error) {
      console.error('请求错误：', error)
      data = '请求错误'
    }
  }
  console.log(data)
  return data
}
/**
 * @description:
 * @param {string} url - 返回Buffer数据
 * @return {*}
 */
async function imageurl(url: string): Promise<Buffer> {
  try {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    console.error('访问错误：', error)
    throw error
  }
}
