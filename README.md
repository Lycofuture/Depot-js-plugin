<!--
 * @Author: Lycofuture
 * @Date: 2023-07-04 13:20:22
 * @LastEditors: Lycofuture 
 * @LastEditTime: 2023-07-30 18:13:36
-->
<h1 align="center">Depot-js-plugin</h1>

<div align="center">

这里是 <a href="https://github.com/Le-niao/Yunzai-Bot" target="_blank">Yunzai-Bot</a> 和 <a href="https://github.com/ningmengchongshui/alemon" target="_blank">Alemon-Bot</a> 的扩展插件

<img src="https://profile-counter.glitch.me/Lycofuture.Depot-js-plugin/count.svg" alt="访问量">

<div align="left">

## 简介

>  js 插件来源于其他插件(也有一些是自己写的)

>  使其单个功能运行避免了多插件打架的情况

  <!-- 吹水群:[600165344](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=Vd1SUaJrOn_Z-MD5rorbosJbWaFZh88b&authKey=ww%2BFngScqxF3Z3QMNpN3bNIdtDd%2FE16Bv3Xawhq13X05TPbxCAvSOJmGXydNIsdO&noverify=0&group_code=600165344) -->

>  暂时就只放个原神交流群([1161397837](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=IZrEpmfWIBP2PJpTeIBgVn6pqyRZ99y1&authKey=xZCFBQBvGj3K%2FJtQ%2Bcuegb8OW5TrScH2%2F%2BhU9eORRwndjajSId7emOo%2BzBxw6CPe&noverify=0&group_code=1161397837))吧

- 如果 github 源拉取失败就用 gitee 源

## 单个安装

- 找到你需要的  [js 插件](#插件列表)   是 | [ts 插件](#插件列表)

- js 文件可执行以下指令进行安装

> 在[插件列表](#插件列表)找到你要安装的插件
>
> 点击右上角的 `原始数据` 或 `raw` 后复制链接以获取 `js` 的链接
>
> 请将下面指令中的 <url> 替换为 js 的链接
> 
> 如 `<url>` 替换为 https://raw.githubusercontent.com/Lycofuture/Depot-js-plugin/main/BackOutBan.js

```bash
curl <url> -P ./plugins/example/
```

- ts 文件复制到 Alemon 插件目录下的 example 文件夹下即可

- 或者执行指令克隆整个库（需要重启）
  
## 插件列表

<div align="center">

![Yunzai-Bot](https://avatars.githubusercontent.com/u/12881780?v=4)

</div>

| 插件                                       | 描述                                                                                                                                            | 指令                                                                     |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [退群不允许加入](./BackOutBan.js)          | 退群后检测踢人并加入黑名单不允许再次加入                                                                                                        | #退群黑名单列表<br>#退群黑名单添加<br>#退群黑名单删除<br>#退群黑名单清空 |
| [日群友](./ByDay.js)                       | 随机给一位群友注射脱氧核糖核酸                                                                                                                  | #日群友                                                                  |
| [计算器](./Calculator.js)                  | 计算器                                                                                                                                          |                                                                          |
| [ChatGPT(无需 key)](./ChatGPT.js)          | ai聊天对话，可修改聊天指令头<br>聊天指令头默认为： //                                                                                           | #gpt接口设置<br>#获取密钥<br>//对话开始<br>结束对话                      |
| [bot上下班](./Commute.js)                  | 控制机器人上下班                                                                                                                                | 上班<br>下班<br>添加主人<br>删除主人                                     |
| [被群友日](./DayMe.js)                     | 随机被一位群友注射脱氧核糖核酸                                                                                                                  | #日我                                                                    |
| [点赞](./DianZan.js)                       | 好友点赞                                                                                                                                        | #赞我                                                                    |
| [娶群友](./FetchWife.js)                   | 娶群友                                                                                                                                          | #娶群友                                                                  |
| [钓鱼游戏](./Fishing.js)                   | 钓鱼插件                                                                                                                                        | #领取普通鱼饵<br>#抛竿普通鱼饵                                           |
| [Q 群头衔](./GiveTitle.js)                 | 给群成员一个头衔                                                                                                                                | #我要头衔                                                                |
| [广播](./GroupAll_user.js)                 | 对所有群聊发送消息                                                                                                                              | #广播                                                                    |
| [群变动通知](./GroupNotification.js)       | 进退群和消息撤回通知<br>使用[防撤回开关](./GroupNotificationswitch.js)进行控制撤回                                                              |
| [防撤回开关](./GroupNotificationswitch.js) | 防撤回控制                                                                                                                                      | #防撤回开启<br>#防撤回关闭                                               |
| [全部指令](./HelpAll.js)                   | 显示bot所有的指令，包括不可用指令                                                                                                               | #helpro                                                                  |
| [插件加载器](./index.js)                   | 加载当前目录插件                                                                                                                                |
| [王者荣耀攻略](./KingRaiders.js)           | 王者技能技巧、出装、英雄克制、搭配及铭文推荐                                                                                                    | #王者妲己攻略                                                            |
| [二次元图片](./lolicon.js)                 | 随机二次元图片                                                                                                                                  | #白毛<br>#黑丝<br>#原神<br>#图片                                         |
| [疯狂星期四](./MadnessThursday.js)         | 获取网页疯狂星期四文案随机发送                                                                                                                  | #疯狂星期四<br>#星期四                                                   |
| [米游社cos](./Myscos.js)                   | 发送今日热榜                                                                                                                                    | #今日cos                                                                 |
| [米游社攻略](./MysRaiders.js)              | 米游社官方攻略                                                                                                                                  | #可莉攻略                                                                |
| [发病](./Onset.js)                         | 回复发病文                                                                                                                                      | #发病                                                                    |
| [幻影图片](./Phantom.js)                   | 合成幻影图片                                                                                                                                    | #幻影                                                                    |
| [戳一戳](./Poke.js)                        | 戳一戳机器人返回信息                                                                                                                            |                                                                          |
| [戳一戳开关](./Pokeswitch.js)              | 戳一戳控制                                                                                                                                      | #戳一戳开启<br>#戳一戳关闭                                               |
| [QQ凶吉](./QQWeights.js)                   | QQ凶吉查询                                                                                                                                      | #查                                                                      |
| [艾特回复](./Replyat.js)                   | 艾特QQ机器人回复信息                                                                                                                            |                                                                          |
| [风控处理](./RiskControlTreatment.js)      | 检测到消息发送失败时，自动使用特殊处理的转发消息再次发送<br>(在 [icqq0.4.12](https://github.com/icqqjs/icqq/releases/tag/v0.4.12) 以上本版失效) |                                                                          |
| [消息缓存](./Setmessage.js)                | 将接收到的消息进行储存，给[群变动通知](./GroupNotification.js)的防撤回使用                                                                      |                                                                          |
| [色图](./Setu.js)                          | 发送二次元图片和三次元图片<br>plus是三次元，其他是二次元                                                                                        | #色图<br>#色图pro<br>#色图plus                                           |
| [搜番剧](./SouFanDrama.js)                 | 通过番剧截图搜索番名及信息                                                                                                                      | #搜番                                                                    |
| [星铁体力](./Srplugin.js)                  | 星穷铁道体力查询和星琼统计                                                                                                                      | #星铁统计<br>#星铁体力                                                   |
| [网页预览](./WebPreview.js)                | 群里发送网页地址，截图预览网页内容                                                                                                              | #百度Yunzai-Bot                                                          |
| [今天吃什么](./Whattoeat.js)               | 看看今天吃啥                                                                                                                                    | 今天吃什么<br>今天早上吃什么<br>今天晚上吃什么<br>换菜单正常模式         |
| [woc指令](./Wocrandom.js)                  | 根据woc神秘指令改的随机图<br>并不是真的woc                                                                                                      | 卧槽<br>来1个老婆<br>wocplus                                             |
| [喊叫](./Yell.js)                          | 自定义喊叫回复内容                                                                                                                              | #叫主人                                                                  |

<div align="center">

![Almeon](https://avatars.githubusercontent.com/u/110824794?v=4)

</div>

| 插件                              | 描述                           | 指令                                                                                                 |
| --------------------------------- | ------------------------------ | ---------------------------------------------------------------------------------------------------- |
| [随心API](./apps/AuroraApi.ts)    | 调用api回复                    | /精选一言<br>/报喜+内容<br>/疯狂星期四<br>/答案之书<br>/早报<br>/每日文<br>/早安<br>/晚安<br>/随机图 |
| [ChatGPT](./apps/ChatGPT.ts)      | 调用ai聊天接口,触发指令/机器人 | /获取密钥<br>/gpt接口设置                                                                            |
| [获取全部指令](./apps/HelpAll.ts) | 只获取ts的指令                 | /helpro                                                                                              |
| [随机图片](./apps/Lolicon.ts)     | 随机二次元图片                 | /白毛<br>/黑丝<br>/原神                                                                              |
| [消息缓存](./apps/Setmessage.ts)  | 将接收到的消息进行储存         |

## 安装

- github 源

```bash
git clone --depth=1 https://github.com/Lycofuture/Depot-js-plugin.git ./plugins/Depot-js-plugin
```

- gitee 源

```bash
git clone --depth=1 https://gitee.com/lycofuture/Depot-js-plugin.git ./plugins/Depot-js-plugin
```

- 安装依赖

```bash
npm -C ./plugins/Depot-js-plugin install -P
```
或
```bash
npm -C ./plugins/Depot-js-plugin install -P
```

</div>
