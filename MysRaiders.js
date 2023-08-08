/**
 * @Author: Lycofuture
 * @Date: 2023-07-02 17:47:10
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-08-08 09:35:22
 */
let mysys =
  'https://api-static.mihoyo.com/common/blackboard/ys_strategy/v1/home/content/list?app_sn=ys_strategy&channel_id=37'
let mysxt =
  'https://api-static.mihoyo.com/common/blackboard/sr_wiki/v1/home/content/list?app_sn=sr_wiki&channel_id=57'
import fetch from 'node-fetch'
import _ from 'lodash'
import plugin from '../../lib/plugins/plugin.js'
import common from '../../lib/common/common.js'

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
let bbscd = false //图片返回cd
export class MysRaiders extends plugin {
  constructor() {
    super({
      name: '米游社攻略',
      dsc: '米游社官方攻略',
      event: 'message',
      priority: -1,
      rule: [
        {
          reg: '^#?(.*)攻略$',
          fnc: 'bbs'
        }
      ]
    })
  }

  async bbs(e) {
    let ace = e.msg.replace(/#|攻略|图片/g, '')
    let esc = matchAlias(ace)
    if (bbscd) {
      e.reply('其他攻略正在执行，请稍候再试')
      return true
    }
    if (!esc) return false
    logger.info(`[查询角色]${esc}`)
    try {
      e.reply(`正在查询${esc}攻略，请稍候...`)
      let msglist = []
      const response = await fetch(mysys)
      const obj = await response.json()
      const ysarr = obj.data.list[0].children[0].children
      for (let i = 0; i < ysarr.length; i++) {
        let curr = ysarr[i]
        if (curr.name.includes(esc)) {
          const name = curr.name
          for (let j = 0; j < curr.list.length; j++) {
            const title = curr.list[j].title
            const bbsUrl = curr.list[j].bbs_url
            const summary = curr.list[j].summary
            const icon = curr.list[j].icon
            msglist.push([
              `角色: ${name}\n标题: ${title}\n概括: ${summary}\n链接地址: ${bbsUrl}\n`,
              segment.image(icon)
            ])
          }
        }
      }
      const responses = await fetch(mysxt)
      const objk = await responses.json()
      const xtarr = objk.data.list[0].children[0].children
      for (let k = 0; k < xtarr.length; k++) {
        let curr = xtarr[k]
        if (curr.name.includes(esc)) {
          const name = curr.name
          for (let p = 0; p < curr.list.length; p++) {
            const title = curr.list[p].title
            const bbsUrl = curr.list[p].bbs_url
            const summary = curr.list[p].summary
            const icon = curr.list[p].icon
            msglist.push([
              `角色: ${name}\n标题: ${title}\n概括: ${summary}\n链接地址: ${bbsUrl}\n`,
              segment.image(icon)
            ])
          }
        }
      }
      const mysbbs = await common.makeForwardMsg(e, msglist, `${esc}攻略图处理完毕`)
      await e.reply(mysbbs)
      logger.info(mysbbs)
    } catch (error) {
      logger.error(error)
    } finally {
      bbscd = false
      return false
    }
  }
}
const aliasMap = {
  //原神角色别名
  '八重神子': [
    '八重神子',
    'YaeMiko',
    'Miko',
    'miko',
    '八重',
    '神子',
    '狐狸',
    '想得美哦',
    '巫女',
    '屑狐狸',
    '骚狐狸',
    '八重宫司',
    '婶子',
    '小八',
    '八重寄子',
    '寄子'
  ],
  '宵宫': ['宵宫', 'Yoimiya', 'yoimiya', '霄宫', '烟花', '肖宫', '肖工', '绷带女孩', '长野原宵宫'],
  '绮良良': [
    '绮良良',
    'Kirara',
    'kirara',
    '琦良良',
    '崎良良',
    '草猫',
    '猫又',
    '宅急便',
    '草猫宅急便',
    '送货员',
    '快递员',
    '草猫快递'
  ],
  '白术': ['白术', 'Baizhu', 'baizhu', '长生', '白术哥哥', '白先生', '白大夫', '白医生', '白求恩'],
  '卡维': ['卡维', 'Kaveh', 'kaveh', '艾尔海森室友', '室友', '建筑设计师', '设计师', '优秀校友'],
  '甘雨': ['甘雨', 'Ganyu', 'ganyu', '椰羊', '椰奶', '王小美'],
  '纳西妲': [
    '纳西妲',
    'Nahida',
    'nahida',
    '草王',
    '草神',
    '花神',
    '小吉祥',
    '小吉祥草王',
    '大慈树王',
    '草萝莉',
    '纳西坦',
    '羽毛球'
  ],
  '妮露': ['妮露', 'Nilou', 'nilou', '尼露', '尼禄', '妮璐', '舞娘', '红牛'],
  '久岐忍': [
    '久岐忍',
    'KukiShinobu',
    'Kuki',
    'kuki',
    'Shinobu',
    'shinobu',
    '97忍',
    '小忍',
    '久歧忍',
    '97',
    '茄忍',
    '茄子',
    '紫茄子',
    '阿忍',
    '忍姐'
  ],
  '神里绫华': [
    '神里绫华',
    'KamisatoAyaka',
    'Ayaka',
    'ayaka',
    '神里',
    '绫华',
    '神里凌华',
    '凌华',
    '白鹭公主',
    '神里大小姐',
    '小乌龟',
    '龟龟'
  ],
  '申鹤': ['甘雨', 'Ganyu', 'ganyu', '椰羊', '椰奶', '王小美'],
  '米卡': ['米卡', 'Mika', 'mika', '米咖', '鹦鹉', '鹦鹉头', '玄凤鹦鹉'],
  '赛诺': ['赛诺', 'Cyno', 'cyno', '塞诺', '胡狼', '牌佬', '打牌佬', '打牌王'],
  '迪希雅': [
    '迪希雅',
    'Dehya',
    'dehya',
    '蒂西亚',
    '迪希亚',
    '西亚',
    '西雅',
    '希雅',
    '鬃狮',
    '希望工程'
  ],
  '夜兰': ['夜兰', 'Yelan', 'yelan', '夜阑', '叶澜', '腋兰', '夜天后'],
  '胡桃': [
    '胡桃',
    'HuTao',
    'hutao',
    'HuTao',
    'hutao',
    'Hutao',
    '胡淘',
    '往生堂堂主',
    '火化',
    '抬棺的',
    '蝴蝶',
    '核桃',
    '堂主',
    '胡堂主',
    '雪霁梅香',
    '桃子'
  ],
  '艾尔海森': [
    '艾尔海森',
    'Alhaitham',
    'alhaitham',
    '爱尔海森',
    '艾尔海参',
    '艾尔',
    '海森',
    '海参',
    '海神'
  ],
  '魈': [
    '魈',
    'Xiao',
    'xiao',
    '打桩机',
    '插秧',
    '三眼五显仙人',
    '三眼五显真人',
    '降魔大圣',
    '护法夜叉',
    '快乐风男',
    '无聊',
    '靖妖傩舞',
    '矮子仙人',
    '三点五尺仙人',
    '跳跳虎'
  ],
  '瑶瑶': ['瑶瑶', 'Yaoyao', 'yaoyao', '遥遥'],
  '雷电将军': [
    '雷电将军',
    'RaidenShogun',
    'Raiden',
    'raiden',
    '雷神',
    '将军',
    '雷军',
    '巴尔',
    '阿影',
    '影',
    '巴尔泽布',
    '煮饭婆',
    '奶香一刀',
    '无想一刀',
    '宅女'
  ],
  '神里绫人': [
    '神里绫人',
    'KamisatoAyato',
    'Ayato',
    'ayato',
    '绫人',
    '神里凌人',
    '凌人',
    '0人',
    '神人',
    '零人',
    '大舅哥'
  ],
  '流浪者': ['流浪者', 'TheWanderer', 'Wanderer', 'wanderer', '散兵', '伞兵'],
  '荒泷一斗': [
    '荒泷一斗',
    'AratakiItto',
    'Itto',
    'itto',
    '荒龙一斗',
    '荒泷天下第一斗',
    '一斗',
    '一抖',
    '荒泷',
    '1斗',
    '牛牛',
    '斗子哥',
    '牛子哥',
    '牛子',
    '孩子王',
    '斗虫',
    '巧乐兹',
    '放牛的'
  ],
  '达达利亚': [
    '达达利亚',
    'Tartaglia',
    'tartaglia',
    'Childe',
    'childe',
    'Ajax',
    'ajax',
    '达达鸭',
    '达达利鸭',
    '公子',
    '玩具销售员',
    '玩具推销员',
    '钱包',
    '鸭鸭',
    '愚人众末席',
    '阿贾克斯'
  ],
  '温迪': [
    '温迪',
    'Venti',
    'venti',
    '温蒂',
    '风神',
    '卖唱的',
    '巴巴托斯',
    '巴巴脱丝',
    '芭芭托斯',
    '芭芭脱丝',
    '干点正事',
    '不干正事',
    '吟游诗人',
    '诶嘿',
    '唉嘿',
    '摸鱼'
  ],
  '珊瑚宫心海': [
    '珊瑚宫心海',
    'SangonomiyaKokomi',
    'Kokomi',
    'kokomi',
    '心海',
    '军师',
    '珊瑚宫',
    '书记',
    '观赏鱼',
    '水母',
    '鱼',
    '美人鱼'
  ],
  '提纳里': [
    '提纳里',
    'Tighnari',
    'tighnari',
    '小提',
    '提那里',
    '缇娜里',
    '提哪里',
    '驴',
    '柯莱老师',
    '柯莱师傅',
    '柯莱师父',
    '巡林官'
  ],
  '钟离': [
    '钟离',
    'Zhongli',
    'zhongli',
    '摩拉克斯',
    '岩王爷',
    '岩神',
    '钟师傅',
    '天动万象',
    '岩王帝君',
    '未来可期',
    '帝君',
    '拒收病婿'
  ],
  '可莉': [
    '可莉',
    'Klee',
    'klee',
    '嘟嘟可',
    '火花骑士',
    '蹦蹦炸弹',
    '炸鱼',
    '放火烧山',
    '放火烧山真君',
    '蒙德最强战力',
    '逃跑的太阳',
    '啦啦啦',
    '哒哒哒',
    '炸弹人',
    '禁闭室',
    '太阳',
    '小太阳'
  ],
  '枫原万叶': [
    '枫原万叶',
    'KaedeharaKazuha',
    'Kazuha',
    'kazuha',
    '万叶',
    '叶天帝',
    '天帝',
    '叶师傅'
  ],
  '优菈': [
    '优菈',
    'Eula',
    'eula',
    '优拉',
    '尤拉',
    '尤菈',
    '浪花骑士',
    '记仇',
    '优菈·劳伦斯',
    '劳伦斯'
  ],
  '阿贝多': [
    '阿贝多',
    'Albedo',
    'albedo',
    '可莉哥哥',
    '升降机',
    '升降台',
    '电梯',
    '白垩之子',
    '贝爷',
    '白垩',
    '阿贝少',
    '花呗多',
    '阿贝夕',
    'abd',
    '阿师傅'
  ],
  '埃洛伊': ['埃洛伊', 'Aloy', 'aloy'],
  '七七': ['七七', 'Qiqi', 'qiqi', '僵尸', '肚饿真君', '度厄真君77'],
  '刻晴': [
    '刻晴',
    'Keqing',
    'keqing',
    '刻情',
    '氪晴',
    '刻师傅',
    '刻师父',
    '牛杂',
    '牛杂师傅',
    '斩尽牛杂',
    '免疫',
    '免疫免疫',
    '屁斜剑法',
    '玉衡星',
    '玉衡',
    '阿晴',
    '啊晴',
    '璃月雷神'
  ],
  '迪卢克': [
    '迪卢克',
    'diluc',
    'Diluc',
    '卢姥爷',
    '姥爷',
    '卢老爷',
    '卢锅巴',
    '正义人',
    '正e人',
    '正E人',
    '卢本伟',
    '暗夜英雄',
    '卢卢伯爵',
    '落魄了',
    '落魄了家人们',
    '迪卢克·莱艮芬德',
    '莱艮芬德'
  ],
  '莫娜': [
    '莫娜',
    'Mona',
    '莫那',
    '摸哪',
    'mona',
    '穷鬼',
    '穷光蛋',
    '穷',
    '莫纳',
    '占星术士',
    '占星师',
    '讨龙真君',
    '半部讨龙真君',
    '阿斯托洛吉斯·莫娜·梅姬斯图斯',
    '阿斯托洛吉斯',
    '梅姬斯图斯',
    '梅姬斯图斯姬',
    '梅姬斯图斯卿'
  ],
  '琴': [
    '琴',
    'Jean',
    'jean',
    '团长',
    '代理团长',
    '琴团长',
    '蒲公英骑士',
    '琴·古恩希尔德',
    '古恩希尔德'
  ],
  '旅行者': [
    '主角',
    '旅行者',
    '卑鄙的外乡人',
    '荣誉骑士',
    '爷',
    '风主',
    '岩主',
    '雷主',
    '草主',
    '履刑者',
    '抽卡不歪真君'
  ],
  '珐露珊': [
    '珐露珊',
    'Faruzan',
    'faruzan',
    '法露珊',
    '发露珊',
    '法露姗',
    '发露姗',
    '发姐',
    '法姐',
    '法63',
    '百岁珊'
  ],
  '莱依拉': ['莱依拉', 'Layla', 'layla', '拉一拉', '莱依菈', '来依菈', '来依拉'],
  '坎蒂丝': ['坎蒂丝', 'Candace', 'candace', '坎迪斯'],
  '柯莱': [
    '柯莱',
    'Collei',
    'collei',
    '可来',
    '克莱',
    '柯来',
    '科莱',
    '科来',
    '小天使',
    '须弥安柏',
    '草安柏',
    '须弥飞行冠军',
    '见习巡林员',
    '巡林员'
  ],
  '多莉': [
    '多莉',
    'Dori',
    'dori',
    '多利',
    '多力',
    '多丽',
    '奸商',
    '多莉·桑歌玛哈巴依',
    '桑歌玛哈巴依'
  ],
  '鹿野院平藏': [
    '鹿野院平藏',
    'shikanoinheizou',
    'Heizou',
    'heizou',
    'heizo',
    '鹿野苑',
    '鹿野院',
    '平藏',
    '鹿野苑平藏',
    '小鹿'
  ],
  '五郎': ['五郎', 'Gorou', 'gorou', '柴犬', '土狗', '希娜', '希娜小姐'],
  '凝光': ['凝光', 'Ningguang', 'ningguang', '富婆', '天权星', '天权'],
  '托马': ['托马', 'Thoma', 'thoma', '家政官', '太郎丸', '地头蛇', '男仆', '拖马'],
  '九条裟罗': ['九条裟罗', 'KujouSara', 'Sara', 'sara', '九条', '九条沙罗', '裟罗', '沙罗', '天狗'],
  '云堇': ['云堇', 'YunJin', 'yunjin', 'yunjin', '云瑾', '云先生', '云锦', '神女劈观', '土女'],
  '罗莎莉亚': [
    '罗莎莉亚',
    'Rosaria',
    'rosaria',
    '罗莎莉娅',
    '白色史莱姆',
    '白史莱姆',
    '修女',
    '罗莎利亚',
    '罗莎利娅',
    '罗沙莉亚',
    '罗沙莉娅',
    '罗沙利亚',
    '罗沙利娅',
    '萝莎莉亚',
    '萝莎莉娅',
    '萝莎利亚',
    '萝莎利娅',
    '萝沙莉亚',
    '萝沙莉娅',
    '萝沙利亚',
    '萝沙利娅'
  ],
  '早柚': ['早柚', 'Sayu', 'sayu', '小狸猫', '狸猫', '忍者', '貉'],
  '雷泽': [
    '雷泽',
    'razor',
    'Razor',
    '狼少年',
    '狼崽子',
    '狼崽',
    '卢皮卡',
    '小狼',
    '小狼狗',
    '狼孩'
  ],
  '菲谢尔': [
    '菲谢尔',
    'Fischl',
    'fischl',
    '皇女',
    '小艾米',
    '小艾咪',
    '奥兹',
    '断罪皇女',
    '中二病',
    '中二少女',
    '中二皇女',
    '奥兹发射器',
    '菲谢尔·冯·露弗施洛斯·那菲多特',
    '露弗施洛斯',
    '那菲多特'
  ],
  '班尼特': [
    '班尼特',
    'Bennett',
    'bennett',
    '点赞哥',
    '点赞',
    '倒霉少年',
    '倒霉蛋',
    '霹雳闪雷真君',
    '班神',
    '班爷',
    '倒霉',
    '火神',
    '六星真神'
  ],
  '烟绯': ['烟绯', 'Yanfei', 'yanfei', '烟老师', '律师', '罗翔'],
  '重云': ['重云', 'Chongyun', 'chongyun', '纯阳之体', '冰棍'],
  '芭芭拉': [
    '芭芭拉',
    'Barbara',
    'barbara',
    '巴巴拉',
    '拉粑粑',
    '拉巴巴',
    '内鬼',
    '加湿器',
    '肉身解咒',
    '肉身解咒真君',
    '闪耀偶像',
    '偶像',
    '芭芭拉·佩奇',
    '佩奇'
  ],
  '迪奥娜': [
    '迪奥娜',
    'Diona',
    'diona',
    '迪欧娜',
    'dio',
    'dio娜',
    '冰猫',
    '猫猫',
    '猫娘',
    '喵喵',
    '调酒师',
    '迪奥娜·凯茨莱茵',
    '凯茨莱茵'
  ],
  '砂糖': ['砂糖', 'Sucrose', 'sucrose', '雷莹术士', '雷萤术士', '雷荧术士'],
  '诺艾尔': ['诺艾尔', 'Noelle', 'noelle', '女仆', '高达', '岩王帝姬'],
  '凯亚': [
    '凯亚',
    'Kaeya',
    'kaeya',
    '盖亚',
    '凯子哥',
    '凯鸭',
    '矿工',
    '矿工头子',
    '骑兵队长',
    '凯子',
    '凝冰渡海真君',
    '凯亚·亚尔伯里奇',
    '亚尔伯里奇'
  ],
  '辛焱': ['辛焱', 'Xinyan', 'xinyan', '辛炎', '黑妹', '摇滚'],
  '香菱': [
    '香菱',
    'Xiangling',
    'xiangling',
    '香玲',
    '锅巴',
    '厨师',
    '万民堂厨师',
    '香师傅',
    '卯香菱'
  ],
  '北斗': ['北斗', 'Beidou', 'beidou', '大姐头', '大姐', '无冕的龙王', '龙王'],
  '行秋': ['行秋', 'Xingqiu', 'xingqiu', '秋秋人', '秋妹妹', '书呆子', '水神', '飞云商会二少爷'],
  '安柏': [
    '安柏',
    'Amber',
    'amber',
    '安伯',
    '兔兔伯爵',
    '飞行冠军',
    '侦查骑士',
    '点火姬',
    '点火机',
    '打火机',
    '打火姬'
  ],
  '丽莎': [
    '丽莎',
    'Lisa',
    'lisa',
    '图书管理员',
    '图书馆管理员',
    '蔷薇魔女',
    '丽莎阿姨',
    '丽莎·敏兹',
    '敏兹'
  ],
  //星铁角色别名
  '阿兰': ['Alan', '阿郎', '阿蓝', 'Arlan'],
  '艾丝妲': ['爱思达', '爱丝妲', '爱思妲', '爱丝达', '艾思达', '艾思妲', '艾丝达', '富婆', 'Asta'],
  '白露': ['龙女', '小龙女', '白鹭', '白鹿', '白麓', 'Bailu'],
  '布洛妮娅': ['布诺妮亚', '布洛妮亚', '布诺妮娅', '布洛尼亚', '鸭鸭', '大鸭鸭', 'Bronya'],
  '丹恒': ['单恒', '单垣', '丹垣', '丹桁', '冷面小青龙', 'DanHeng'],
  '黑塔': ['人偶', '转圈圈', 'Herta'],
  '虎克': ['胡克', 'Hook'],
  '姬子': ['机子', '寄子', 'Himeko'],
  '杰帕德': ['杰哥', 'Gepard'],
  '景元': ['JingYuan', '景云'],
  '开拓者·存护': ['火爷', '火主', '开拓者存护', '火开拓者'],
  '开拓者·毁灭': ['物理爷', '物爷', '物理主', '物主', '开拓者毁灭', '岩开拓者'],
  '克拉拉': ['可拉拉', '史瓦罗', 'Clara'],
  '娜塔莎': ['那塔莎', '那塔沙', '娜塔沙', 'Natasha', '渡鸦'],
  '佩拉': ['配拉', '佩啦', '冰砂糖', 'Pela'],
  '青雀': ['青却', '卿雀', 'Qingque'],
  '三月七': ['三月', '看板娘', '三七', '三祁', '纠缠之缘', 'March7th', '37'],
  '桑博': ['Sampo'],
  '素裳': ['李素裳', 'Sushang'],
  '停云': ['停运', '听云', 'Tingyun'],
  '瓦尔特': ['杨叔', '老杨', 'Welt'],
  '希儿': ['希尔', 'Seele'],
  '希露瓦': ['希录瓦', 'Serval'],
  '彦卿': ['言情', '彦情', '彦青', '言卿', '燕青', 'Yanqing'],
  '银狼': ['淫狼', '音浪', 'yinglang', 'Yinglang', '野狼', '英朗']
}

function matchAlias(input) {
  const aliasKey = _.findKey(aliasMap, (value, key) => {
    return key === input || value.includes(input)
  })
  return aliasKey || null
}
