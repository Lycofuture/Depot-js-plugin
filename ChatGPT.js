/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:10:00
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-05 23:53:35
 * 聊天触发指令为默认为“//”，可自行更改
 */
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
import fs from 'fs'

const command = '//' // 聊天指令头

if (!global.segment) {
    try {
        global.segment = (await import('icqq')).segment
    } catch {
        try {
            global.segment = (await import('oicq')).segment
        } catch {
        }
    }
}

let pathToDir = `${process.cwd()}/data/example`
if (!fs.existsSync(pathToDir)) {
    // 如果目录不存在，则创建它
    fs.mkdirSync(pathToDir, {
        recursive: true
    })
}
const pathgpt = `${pathToDir}/ChatGPT.json`
if (!fs.existsSync(pathgpt)) {
    // 如果文件不存在，则创建它并初始化值
    fs.writeFileSync(
        pathgpt,
        JSON.stringify({
            school: 0
        })
    )
}
let jsonData = fs.readFileSync(pathgpt, 'utf-8')
let data = JSON.parse(jsonData)
const COOLDOWN_TIME = Math.floor(Math.random() * 1000) + 1000
let key = {}
// 请求地址
const urls = [
    'http://api.qingyunke.com/api.php', // 青云客api
    'http://api.sc1.fun/API/ChatGPT.php', // ChatGPT-3.5连续对话模型[无需apikey,打造最优质的API]
    'https://api.a20safe.com/api.php', // 版本ChatGPT3.5，支持连续对话，支持多对话[关注云析API铺获取key]
    'http://xinnai.521314.love/API/ChatGPT.php', // ChatGPT-3.5连续对话模型[无需apikey,打造最优质的API]
    'https://wmapi.wenbo.li/api/gpt/four', // GPT-4-0314模型进行AI智能对话
    'https://xiaobai.klizi.cn/API/other/gpt.php', // GPT3.5
    'http://api.starchent.top/API/ChatGPT.php' // ChatGPT-3.5连续对话模型
]
let code, email, opt

// 请求参数,对应请求地址依次排序
function paramsArray(msg, num, key = {}) {
    const Array = [
        {
            key: 'free',
            appid: '0',
            msg: msg,
            // type: data[e.user_id].aid ? '' : 'get',
            // ...(data[e.user_id].aid && { id: data[e.user_id].aid })
        },
        {
            msg: msg,
            type: 'wifi',
            mos: 'json',
            id: '1',
        },
        {
            api: '36',
            key: key,
            text: msg,
        },
        {
            msg: msg,
            type: 'wifi',
            mos: 'json',
            id: '1',
        },
        {
            message: msg,
        },
        {
            msg: msg,
        },
        {
            msg: msg,
            type: 'wifi',
            mos: 'json',
            id: '1',
        },
    ]
    return Array[num]
}

const jksz = [
    '示例：#gpt设置接口0\n',
    '接口有:\n',
    '0. 青云客api, 连继续对话\n',
    '1. ChatGPT-3.5连续对话模型\n',
    '2. ChatGPT3.5, 支持连续对话，支持多对话(需要key, 非官方)\n',
    '3. ChatGPT-3.5连续对话模型\n',
    '4. GPT-4-0314模型进行AI智能对话\n',
    '5. GPT3.5\n',
    '6. ChatGPT-3.5连续对话模型'
]


export class ChatGPT extends plugin {
    constructor() {
        super({
            name: 'gpt3.5',
            dsc: 'ai聊天对话',
            event: 'message',
            priority: 5000000,
            rule: [
                {
                    reg: /^#?gpt(接口|密钥)设置(.*)/,
                    fnc: 'setkey'
                },
                {
                    reg: /^#?获取密钥$/,
                    fnc: 'appsetkey'
                },
                {
                    reg: /.*/g,
                    fnc: 'gpt',
                    log: false
                }
            ]
        })
        this.pattern = new RegExp('^' + command)
    }

    async setkey(e) {
        let msg = this.e.msg
        if (/密钥/.test(msg)) {
            let esc = msg.replace(/#|gpt密钥设置/g, '')
            console.log(esc)
            if (parseInt(data[e.user_id].num) === 2) {
                if (/^[0-9a-z]{32}$/i.test(esc)) {
                    data[e.user_id].a20key = esc
                    e.reply('密钥设置成功')
                } else {
                    e.reply('密钥设置错误')
                }
            } else {
                e.reply(`当前接口为：${data[e.user_id].num},不需要设置密钥`)
            }
        } else if (/接口/.test(msg)) {
            let esc = msg.replace(/[^0-9]/g, '')
            if (esc >= urls.length || !esc) {
                e.reply([`接口设置错误\n${jksz.join('')}`])
            } else {
                data[e.user_id].num = esc
                e.reply(`接口设置为${esc}成功`)
            }
        }
        jsonData = JSON.stringify(data, null, 2)
        fs.writeFileSync(pathgpt, jsonData, 'utf8')
        return true
    }

    async gpt(e) {
        let msg = this.e.msg
        let hasBlankMessage = this.e.atme && this.e.msg
        if ((hasBlankMessage || this.pattern.test(msg)) && e.isGroup) {
            e.reply('正在思考您发送的内容...')
            await this.scgpt(e)
        } else if (e.isPrivate) {
            await this.scgpt(e)
        }
        return false
    }

    async scgpt(e) {
        if (!data[e.user_id]) {
            data[e.user_id] = {}
        }
        if (data[e.user_id].num === undefined) {
            data[e.user_id].num = 0
            e.reply('未设置接口，初始化接口为0。可发送\'gpt接口设置\'更换接口')
        }
        if (isCooldown(e.user_id)) {
            let remainingTimeInSeconds = Math.ceil(
                (COOLDOWN_TIME - (Date.now() - data[e.user_id].updatedAt)) / 1000
            )
            await e.reply(`请稍等${remainingTimeInSeconds}秒后再试。`)
            return
        }
        if (parseInt(data[e.user_id].num) === 2) {
            if (!data[e.user_id].a20key) {
                await e.reply(
                    `当前接口为: ${data[e.user_id].num
                    }\n请发送[#获取密钥]或者[#gpt密钥设置]后在使用`
                )
            } else {
                key = data[e.user_id].a20key
            }
        }
        let start = process.hrtime()
        let msg = e.msg.replace(this.pattern, '')
        let selectedUrl = urls[data[e.user_id].num]
        let selectedParams = paramsArray(msg, data[e.user_id].num, key)

        // 拼接选中的 URL 和参数
        const queryParams = Object.keys(selectedParams)
            .map((key) => `${key}=${selectedParams[key]}`)
            .join('&')
        const finalUrl = `${selectedUrl}?${queryParams}`
        const surl = await fetchData(finalUrl)
        let eoose = '接口访问失败，请更换接口后再试'
        let txts
        if (surl) {
            if (parseInt(data[e.user_id].num) === 0) {
                let txtentso
                try {
                    txtentso = JSON.parse(surl)
                    txts = txtentso.content
                } catch {
                    txts = surl
                }
            } else if (parseInt(data[e.user_id].num) === 1) {
                if (surl.code == 200) {
                    txts = surl.message
                } else {
                    txts = eoose + surl
                }
            } else if (parseInt(data[e.user_id].num) === 2) {
                if (surl.code == 0 && surl?.data?.[0]?.reply !== undefined) {
                    txts = surl.data[0].reply
                } else {
                    txts = surl.msg || eoose + surl
                }
            } else if (parseInt(data[e.user_id].num) === 3) {
                if (surl.code == 200) {
                    txts = surl.message
                } else {
                    txts = eoose + surl
                }
            } else if (parseInt(data[e.user_id].num) === 4) {
                if (surl.code == 200) {
                    txts = surl.answer
                } else {
                    txts = eoose + surl
                }
            } else if (parseInt(data[e.user_id].num) === 5) {
                txts = surl
            } else if (parseInt(data[e.user_id].num) === 6) {
                if (surl.code == 200) {
                    txts = surl.message
                } else {
                    txts = eoose + surl
                }
            }
        }
        try {
            let durationInNanoseconds = process.hrtime(start)
            let durationInSeconds =
                durationInNanoseconds[0] + durationInNanoseconds[1] / 1e9
            // 计算时间
            let hours = Math.floor(durationInSeconds / 3600)
            let minutes = Math.floor((durationInSeconds - hours * 3600) / 60)
            let seconds = Math.round(durationInSeconds - hours * 3600 - minutes * 60)
            if (e.isPrivate) {
                e.reply(txts.replace(/\\n/g, '\n'))
            } else {
                e.reply(
                    `接口${data[e.user_id].num
                    }:\n${txts.replace(/\\n/g, '\n')}\n\n执行时长 ${hours} 时 ${minutes} 分 ${seconds} 秒\n共执行${data.school
                    }次`,
                    true
                )
            }
        } catch (err) {
            console.error(err)
            e.reply(`出错了:${JSON.stringify(err)}`)
        }
        const updatedAt = Date.now()
        data[e.user_id].COOLDOWN_TIME = COOLDOWN_TIME
        data[e.user_id].updatedAt = updatedAt
        data.school++
        jsonData = JSON.stringify(data, null, 2)
        fs.writeFileSync(pathgpt, jsonData, 'utf8')
        return false
    }

    async appsetkey(e) {
        if (e.isPrivate) {
            this.setContext('getEmail')
            await e.reply('请输入您的邮箱', true)
        } else {
            e.reply('请私聊使用')
        }
    }

    async getEmail(e) {
        email = this.e.message[0].text
        this.finish('getEmail')
        this.setContext('getemopt')
        await e.reply(
            '请输入操作id\n1:注册key\n2:重置key\n3:绑定微信\n4:找回key',
            true
        )
    }

    async getemopt(e) {
        opt = this.e.message[0].text
        if (opt > 4) return e.reply('id错误')
        let url = `https://api.a20safe.com/api.php?api=39&mail=${email}&opt=${opt}`
        let surl = await fetchData(url)
        if (surl.code == 0) {
            await e.reply(surl.data[0].result)
        } else {
            e.reply('出错了！')
        }
        this.finish('getemopt')
        if (opt == 1) {
            this.setContext('Applykey')
            await e.reply('请输入您的验证码', true)
        } else if (opt == 2) {
            this.setContext('resetkey')
            await e.reply('请输入您的验证码', true)
        } else if (opt == 3) {
            e.reply('暂不支持')
        } else if (opt == 4) {
            this.setContext('getkey')
            await e.reply('请输入您的验证码', true)
        }
    }

    async Applykey(e) {
        code = this.e.message[0].text
        let url = `https://api.a20safe.com/api.php?api=47&mail=${email}&code=${code}`
        let surl = await fetchData(url)
        if (surl.code == 0) {
            if (/^[0-9a-z]{32}$/i.test(surl.data[0].result)) {
                await e.reply(`您的密钥是：\n${surl.data[0].result}`)
                data[e.user_id].a20key = surl.data[0].result
                jsonData = JSON.stringify(data, null, 2)
                fs.writeFileSync(pathgpt, jsonData, 'utf8')
            } else {
                await e.reply(surl.data[0].result)
            }
        } else {
            e.reply('出错了！')
        }
        this.finish('Applykey')
    }

    async resetkey(e) {
        code = this.e.message[0].text
        let url = `https://api.a20safe.com/api.php?api=46&mail=${email}&code=${code}`
        let surl = await fetchData(url)
        if (surl.code == 0) {
            if (/^[0-9a-z]{32}$/i.test(surl.data[0].result)) {
                await e.reply(`您的密钥是：\n${surl.data[0].result}`)
                data[e.user_id].a20key = surl.data[0].result
                jsonData = JSON.stringify(data, null, 2)
                fs.writeFileSync(pathgpt, jsonData, 'utf8')
            } else {
                await e.reply(surl.data[0].result)
            }
        } else {
            e.reply('出错了！')
        }
        this.finish('resetkey')
    }

    async getkey(e) {
        code = this.e.message[0].text
        let url = `https://api.a20safe.com/api.php?api=45&mail=${email}&code=${code}`
        let surl = await fetchData(url)
        if (surl.code == 0) {
            if (/^[0-9a-z]{32}$/i.test(surl.data[0].result)) {
                await e.reply(`您的密钥是：\n${surl.data[0].result}`)
                data[e.user_id].a20key = surl.data[0].result
                jsonData = JSON.stringify(data, null, 2)
                fs.writeFileSync(pathgpt, jsonData, 'utf8')
            } else {
                await e.reply(surl.data[0].result)
            }
        } else {
            e.reply('出错了！')
        }
        this.finish('getkey')
    }
}

// 判断是否处于冷却状态
function isCooldown(userId) {
    if (data[userId]) {
        const elapsed = Date.now() - data.updatedAt
        return elapsed < COOLDOWN_TIME
    } else {
        return false
    }
}

async function fetchData(url) {
    let data
    try {
        const response = await fetch(url)
        const contentType = response.headers.get('content-type')
        if (contentType.includes('json')) {
            data = await response.json()
        } else {
            data = await response.text()
        }
    } catch (error) {
        console.error('请求错误：', error)
        data = '请求错误'
    }
    return data
}
