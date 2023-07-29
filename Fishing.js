/**
 * @Author: @wan13877501248
 * @Date: 2023-06-10 19:40:53
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 10:24:08
 */
import fs from 'fs'
const _path = process.cwd()
let fish = {
  小丑鱼: 30,
  牛子鱼: 50,
  鲨鱼: 100,
  鲸鱼: 150,
  美人鱼: 500
}
let bag
let dirPath = _path + '/data/diaoyu'
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath)
}

export class Fishing extends plugin {
  constructor() {
    super({
      name: '阴天',
      dsc: '钓鱼',
      event: 'message',
      priority: 1,
      rule: [
        {
          reg: '^#抛竿(.*)',
          fnc: 'paogan'
        },
        {
          reg: '^#领取普通鱼饵',
          fnc: 'lqye'
        },
        {
          reg: '^#卖出我的鱼',
          fnc: 'my'
        },
        {
          reg: '^#钓鱼商店',
          fnc: 'yesd'
        },
        {
          reg: '^#购买(.*)',
          fnc: 'gm'
        },
        {
          reg: '^#查看背包',
          fnc: 'bk'
        }
      ]
    })
  }
  async paogan(e) {
    await this.jiancha(e)
    if (
      e.msg.replace('#抛竿', '').trim() !== '普通鱼饵' &&
      e.msg.replace('#抛竿', '').trim() !== '高级鱼饵' &&
      e.msg.replace('#抛竿', '').trim() !== '超级鱼饵'
    ) {
      e.reply('请在#抛竿后面加上你所要设置的鱼饵，如：#抛竿 普通鱼饵')
      return true
    }
    let yuer = e.msg.replace('#抛竿', '').trim()
    await this.jiancha2(e)
    if (!bag.bb.includes(yuer)) {
      e.reply('你没有这种鱼饵，请去 #钓鱼商店 购买高级鱼饵或者发送#领取普通鱼饵 以领取')
      return true
    }
    bag.bb.splice(bag.bb.indexOf(yuer), 1)
    fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
    if (bag.钓竿 == '普通钓竿') {
      e.reply('你已经开始钓鱼了，请耐心等待。')
      let i = 120
      let timer = setInterval(async () => {
        i--
        if (i === 0) {
          if (yuer == '普通鱼饵') {
            let result = await this.pt(e)
            await this.result(e, result)
          } else if (yuer == '高级鱼饵') {
            let result = await this.gj(e)
            await this.result(e, result)
          } else if (yuer == '超级鱼饵') {
            let result = await this.cj(e)
            await this.result(e, result)
          }
          clearInterval(timer)
        }
      }, 1000)
    } else {
      e.reply('尊贵的超级钓竿用户您好，你已经开始钓鱼了，你的钓鱼用时减半，请耐心等待。')
      let i = 60
      let timer = setInterval(async () => {
        i--
        if (i === 0) {
          if (yuer == '普通鱼饵') {
            let result = await this.pt(e)
            await this.result(e, result)
          } else if (yuer == '高级鱼饵') {
            let result = await this.gj(e)
            await this.result(e, result)
          } else if (yuer == '超级鱼饵') {
            let result = await this.cj(e)
            await this.result(e, result)
          }
          let randomNum2 = Math.random()
          if (randomNum2 < 0.3) {
            e.reply('您的超级钓竿触发了概率事件：致命节奏，为您额外秒钓了一条鱼上来。')
            if (yuer == '普通鱼饵') {
              let result = await this.pt(e)
              await this.result(e, result)
            } else if (yuer == '高级鱼饵') {
              let result = await this.gj(e)
              await this.result(e, result)
            } else if (yuer == '超级鱼饵') {
              let result = await this.cj(e)
              await this.result(e, result)
            }
          }
          clearInterval(timer)
        }
      }, 1000)
    }
  }
  async lqye(e) {
    await this.jiancha(e)
    await this.jiancha2(e)
    bag.bb.push('普通鱼饵')
    fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
    e.reply('领取成功')
  }
  async my(e) {
    await this.jiancha(e)
    await this.jiancha2(e)
    let money = 0
    let fishIndexs = []
    for (let o = 0; o < bag.bb.length; o++) {
      if (bag.bb[o].includes('鱼')) {
        money += parseInt(fish[bag.bb[o]])
        fishIndexs.push(o)
      }
    }
    for (let i = fishIndexs.length - 1; i >= 0; i--) {
      bag.bb.splice(fishIndexs[i], 1)
    }
    bag.money += money
    fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
    e.reply('已经全部卖出，总计获得' + `${money}元，你现在一共有${bag.money}元`)
  }
  async yesd(e) {
    let msg = ['高级鱼饵：50元\n', '超级鱼饵：100元\n', '超级钓竿：1500元\n发送#购买+物品 即可购买']
    e.reply(msg)
  }
  async gm(e) {
    await this.jiancha(e)
    await this.jiancha2(e)
    if (
      e.msg.replace('#购买', '').trim() !== '超级钓竿' &&
      e.msg.replace('#购买', '').trim() !== '高级鱼饵' &&
      e.msg.replace('#购买', '').trim() !== '超级鱼饵'
    ) {
      e.reply('请在#购买后面加上正确的商品名，如：#购买 超级钓竿')
      return true
    }
    let sp = e.msg.replace('#购买', '').trim()
    let jg = {
      高级鱼饵: 50,
      超级鱼饵: 100,
      超级钓竿: 1500
    }
    if (jg[sp] > bag.money) {
      e.reply('你买不起，穷鬼！')
      return true
    }
    bag.money = bag.money - jg[sp]
    if (sp == '超级钓竿') {
      bag.钓竿 = '超级钓竿'
    } else {
      bag.bb.push(sp)
    }
    fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
    e.reply('购买成功，你现在一共还剩下' + `${bag.money}元`)
  }
  async bk(e) {
    await this.jiancha(e)
    await this.jiancha2(e)
    let itemObj = {}
    for (let i = 0; i < bag.bb.length; i++) {
      let item = bag.bb[i]
      if (!itemObj[item]) {
        itemObj[item] = 1
      } else {
        itemObj[item]++
      }
    }
    let result = ''
    if (itemObj !== {}) {
      for (let key in itemObj) {
        if (itemObj.hasOwnProperty(key)) {
          result += `${key}*${itemObj[key]},`
        }
      }
    }
    if (result !== '') {
      result = result.substring(0, result.length - 1)
    }
    if ((result == '') | (result == ' ') | (result == null)) {
      result = '空'
    }
    e.reply(`你现在使用的钓竿为：${bag.钓竿}\n背包：${result}\n还剩下${bag.money}元`)
  }
  async jiancha(e) {
    if (!fs.existsSync(dirPath + '/' + `${e.user_id}.json`)) {
      fs.appendFileSync(
        dirPath + '/' + `${e.user_id}.json`,
        JSON.stringify({
          bb: [],
          money: 0,
          钓竿: '普通钓竿'
        })
      )
    }
  }
  async jiancha2(e) {
    try {
      let data = fs.readFileSync(dirPath + '/' + `${e.user_id}.json`)
      let obj = JSON.parse(data)
      bag = obj
    } catch (err) {
      e.reply(err)
    }
  }
  async pt(e) {
    let randomNum = Math.random()
    if (randomNum < 0.8) {
      return 1
    } else if (randomNum < 0.9) {
      return 2
    } else {
      return 3
    }
  }
  async gj(e) {
    let randomNum = Math.random()
    if (randomNum < 0.4) {
      return 1
    } else if (randomNum < 0.7) {
      return 2
    } else if (randomNum < 0.9) {
      return 3
    } else if (randomNum < 0.98) {
      return 4
    } else if (randomNum < 1) {
      return 5
    }
  }
  async cj(e) {
    let randomNum = Math.random()
    if (randomNum < 0.1) {
      return 1
    } else if (randomNum < 0.3) {
      return 2
    } else if (randomNum < 0.6) {
      return 3
    } else if (randomNum < 0.9) {
      return 4
    } else if (randomNum < 1) {
      return 5
    }
  }
  async result(e, result) {
    if (result == 1) {
      await this.jiancha2(e)
      bag.bb.push('小丑鱼')
      fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
      e.reply([segment.at(e.user_id), '恭喜你，获得一条小丑鱼，已经放入您的背包里了。'])
    } else if (result == 2) {
      await this.jiancha2(e)
      bag.bb.push('牛子鱼')
      fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
      e.reply([segment.at(e.user_id), '恭喜你，获得一条牛子鱼，已经放入您的背包里了。'])
    } else if (result == 3) {
      await this.jiancha2(e)
      bag.bb.push('鲨鱼')
      fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
      e.reply([segment.at(e.user_id), '恭喜你，获得一条鲨鱼，已经放入您的背包里了。'])
    } else if (result == 4) {
      await this.jiancha2(e)
      bag.bb.push('鲸鱼')
      fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
      e.reply([segment.at(e.user_id), '恭喜你，获得一条鲸鱼，已经放入您的背包里了。'])
    } else if (result == 5) {
      await this.jiancha2(e)
      bag.bb.push('美人鱼')
      fs.writeFileSync(dirPath + '/' + `${e.user_id}.json`, JSON.stringify(bag))
      e.reply([segment.at(e.user_id), '恭喜你，获得一条美人鱼，已经放入您的背包里了。'])
    }
  }
}
