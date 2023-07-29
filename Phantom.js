/**
 * @Author: Lycofuture
 * @Date: 2023-05-02 16:56:03
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-29 12:26:25
 * 需要先手动安装三个包，如果有cnpm或者pnpm 可以代替npm安装
 * 需要安装依赖 pnpm add arraybuffer-to-buffer jimp mathjs
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
import Jimp from 'jimp'
import ab2b from 'arraybuffer-to-buffer'
import * as mjs from 'mathjs'
import plugin from '../../lib/plugins/plugin.js'
import fetch from 'node-fetch'
export class Phantom extends plugin {
  constructor() {
    super({
      name: '幻影图片',
      dsc: '幻影图片',
      event: 'message',
      priority: 400,
      rule: [
        {
          reg: '^#?幻影$',
          fnc: 'qqhuanying'
        }
      ]
    })
  }
  async qqhuanying() {
    let message = this.e.message
    console.log(message)
    const images = []
    for (let i in message) {
      if (message[i].type == 'image') {
        images.push(message[i].url)
      }
    }
    if (images.length < 2) {
      this.e.reply('至少需要两张图片才能完成幻影图片')
      return 'return'
    }
    let [first, second] = images
    console.log(images)
    let firstResponse = await fetch(first, {
      method: 'get',
      responseType: 'arraybuffer'
    })
    const firstBuffer = await firstResponse.arrayBuffer()
    let secondResponse = await fetch(second, {
      method: 'get',
      responseType: 'arraybuffer'
    })
    const secondBuffer = await secondResponse.arrayBuffer()
    const image = await this.buildImage(firstBuffer, secondBuffer)
    const base64Str = 'base64://' + image.split(',')[1]
    await this.reply(segment.image(base64Str))
  }
  async buildImage(top, bottom) {
    const topImage = await Jimp.read(ab2b(top))
    const bottomImage = await Jimp.read(ab2b(bottom)).then(lenna => {
      return lenna.contain(topImage.bitmap.width, topImage.bitmap.height) // resize
    })
    return new Promise((resolve, reject) => {
      const top = new MirageTankImage(topImage)
      const bottom = new MirageTankImage(bottomImage)
      top.desaturate()
      bottom.desaturate()
      top.adjustLightness(0.5)
      bottom.adjustLightness(-0.5)
      top.invert()
      top.linearDodgeBlend(bottom)
      const linearDodged = top.clone()
      top.divideBlend(bottom)
      top.toRGBA(linearDodged.getData())
      const result = new Jimp({
        data: top.toUint8Array(),
        width: topImage.bitmap.width,
        height: topImage.bitmap.height
      })
      resolve(result.getBase64Async(Jimp.MIME_PNG))
    })
  }
}
class MirageTankImage {
  width
  height
  channel
  data
  constructor(image) {
    if (image instanceof Jimp) {
      image = image
      this.width = image.bitmap.width
      this.height = image.bitmap.height
      const matrix = mjs.zeros([this.height, this.width, 3], 'dense')
      image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, index) {
        matrix.set([y, x, 0], this.bitmap.data[index])
        matrix.set([y, x, 1], this.bitmap.data[index] + 1)
        matrix.set([y, x, 2], this.bitmap.data[index] + 2)
      })
      this.data = matrix
      this.channel = 3
    } else {
      image = image
      const size = image.size()
      this.width = size[1]
      this.height = size[0]
      this.channel = size[2]
      this.data = image
    }
  }
  getData() {
    return this.data
  }
  desaturate() {
    this.data = mjs.divide(mjs.add(mjs.max(this.data, 2), mjs.min(this.data, 2)), 2)
    this.channel = 1
  }
  invert() {
    this.data = mjs.subtract(255, this.data)
  }
  adjustLightness(ratio) {
    if (ratio > 0) {
      this.data = mjs.add(mjs.multiply(this.data, 1 - ratio), 255 * ratio)
    } else {
      this.data = mjs.multiply(this.data, 1 + ratio)
    }
  }
  linearDodgeBlend(image) {
    this.data = mjs.add(this.data, image.getData())
  }
  divideBlend(image) {
    const result = mjs.zeros([this.height, this.width], 'dense')
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    this.data.forEach((value, index) => {
      const i = mjs.index(...index)
      // @ts-ignore
      const mix = this.data.subset(i)
      // @ts-ignore
      const base = image.getData().subset(i)
      let color
      switch (mix) {
        case 0:
          color = base === 0 ? 0 : 255
          break
        case 255:
          color = base
          break
        case base:
          color = 255
          break
        default:
          color = mjs.round((base / mix) * 255)
      }
      result.set([...index], color)
    })
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    this.data = result
  }
  clone() {
    return new MirageTankImage(this.data.clone())
  }
  toRGBA(data) {
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    this.data = this.data.map((value, index) => {
      value = mjs.round(value)
      if (value > 255) {
        value = 255
      }
      if (value < 0) {
        value = 0
      }
      // @ts-ignore
      const alpha = data ? data.subset(mjs.index(...index)) : 255
      return [value, value, value, alpha]
    })
    /* eslint-enable @typescript-eslint/ban-ts-comment */
    this.channel = 4
  }
  toUint8Array() {
    return new Uint8Array(this.data.toArray().flat(2))
  }
}
