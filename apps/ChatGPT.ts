/* eslint-disable prefer-const */
/*
 * @Author: Lycofuture
 * @Date: 2023-06-27 18:24:51
 * @Last Modified by: Lycofuture
 * @Last Modified time: 2023-06-28 19:13:13
 * 修改js版本，适配频道
 * 放到根目录的example下即可使用
 */
import {
  plugin,
  conversationHandlers,
  setConversationState,
  deleteConversationState,
  Messagetype,
} from "alemon";
import fetch from "node-fetch";
import fs from "fs";
const pathToDir = `${process.cwd()}/data/example`;
if (!fs.existsSync(pathToDir)) {
  fs.mkdirSync(pathToDir, {
    recursive: true,
  });
}
const pathgpt = `${pathToDir}/ChatGPT.json`;
if (!fs.existsSync(pathgpt)) {
  fs.writeFileSync(
    pathgpt,
    JSON.stringify({
      school: 0,
    })
  );
}
let jsonData = fs.readFileSync(pathgpt, "utf-8");
let data = JSON.parse(jsonData);
const COOLDOWN_TIME = Math.floor(Math.random() * 1000) + 1000;
const urls = [
  "http://ovoa.cc/api/liaotian.php",
  "http://api.sc1.fun/API/ChatGPT.php",
  "https://api.a20safe.com/api.php",
  "http://xinnai.521314.love/API/ChatGPT.php",
  "https://wmapi.wenbo.li/api/gpt/four",
  "https://xiaobai.klizi.cn/API/other/gpt.php",
  "http://api.starchent.top/API/ChatGPT.php",
];
let code, email, opt;
export class ChatGPT extends plugin {
  constructor() {
    super({
      rule: [
        {
          reg: /^\/?获取密钥/,
          fnc: "appsetkey",
        },
        {
          reg: /^\/?gpt(接口|密钥)设置(.*)/,
          fnc: "setkey",
        },
        {
          reg: /^\/?机器人(.*)/,
          fnc: "scgpt",
        },
      ],
    });
  }
  async setkey(e: Messagetype): Promise<boolean> {
    console.log("[setkey]", "任务触发");
    let msg = e.cmd_msg;
    if (/密钥/.test(msg)) {
      let esc = msg.replace(/\/gpt密钥设置/, "");
      if (parseInt(data[e.msg.author.id].num) === 2) {
        if (!esc) {
          e.reply("密钥不能为空");
          return true;
        }
        if (/^[0-9a-z]{32}$/i.test(esc)) {
          data[e.msg.author.id].a20key = esc;
          e.reply(`密钥设置成功`);
        } else {
          e.reply("密钥设置错误");
        }
      } else {
        e.reply(`当前接口为：${data[e.msg.author.id].num},不需要设置密钥`);
      }
    } else if (/接口/.test(msg)) {
      let jksz = [
        "示例：#gpt接口0\n",
        "接口有:\n",
        "0.聊天接口\n",
        "1.ChatGPT-3.5连续对话模型\n",
        "2.ChatGPT3.5，支持连续对话，支持多对话(需要key，非官方)\n",
        "3.ChatGPT-3.5连续对话模型\n",
        "4.GPT-4-0314模型进行AI智能对话\n",
        "5.GPT3.5\n",
        "6.ChatGPT-3.5连续对话模型",
      ];
      let esc = msg.replace(/\s/g, "").replace(/\/gpt接口设置/, "");
      console.log(esc);
      if (!esc || Number(esc) >= urls.length) {
        const msg = `接口设置错误\n${jksz.join("")}`;
        console.log((await e.reply(msg)) ? "消息已发送" : "消息发送失败");
        return true;
      } else {
        data[e.msg.author.id].num = esc;
        e.reply(`接口设置为${esc}成功`);
      }
    }
    jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(pathgpt, jsonData, "utf8");
    return false;
  }
  async scgpt(e: Messagetype): Promise<boolean> {
    console.log("[scgpt]", "任务触发");
    if (!data[e.msg.author.id]) {
      data[e.msg.author.id] = {};
    }
    if (data[e.msg.author.id].num === undefined) {
      data[e.msg.author.id].num = 0;
      e.reply("未设置接口，初始化接口为0。可发送'gpt接口'更换接口");
    }
    if (isCooldown(e.msg.author.id)) {
      let remainingTimeInSeconds = Math.ceil(
        (COOLDOWN_TIME - (Date.now() - data[e.msg.author.id].updatedAt)) / 1000
      );
      await e.reply(`请稍等${remainingTimeInSeconds}秒后再试。`);
      return true;
    }
    if (
      parseInt(data[e.msg.author.id].num) === 2 &&
      !data[e.msg.author.id].a20key
    ) {
      e.reply(
        `当前接口为: ${data[e.msg.author.id].num
        }\n请发送[/gpt密钥]设置密钥(非官方key)后在使用`
      );
      return true;
    }
    let start = process.hrtime();
    let txt = e.cmd_msg;
    let msg = txt.replace(/^\/机器人/, "");
    e.reply("正在思考您发送的内容...");
    //请求参数,对应请求地址依次排序
    const paramsArray = [
      {
        msg: msg,
      },
      {
        msg: msg,
        type: "wifi",
        mos: "json",
        id: "1",
      },
      {
        api: "36",
        key: data[e.msg.author.id].a20key,
        text: msg,
      },
      {
        msg: msg,
        type: "wifi",
        mos: "json",
        id: "1",
      },
      {
        message: msg,
      },
      {
        msg: msg,
      },
      {
        msg: msg,
        type: "wifi",
        mos: "json",
        id: "1",
      },
    ];
    let selectedUrl = urls[data[e.msg.author.id].num];
    let selectedParams = paramsArray[data[e.msg.author.id].num];
    // 拼接选中的 URL 和参数
    const queryParams = Object.keys(selectedParams)
      .map((key) => `${key}=${selectedParams[key]}`)
      .join("&");
    const finalUrl = `${selectedUrl}?${queryParams}`;
    let surl = await fetchData(finalUrl);
    let eoose = "接口访问失败，请更换接口后再试";
    let txts;
    if (surl) {
      if (parseInt(data[e.msg.author.id].num) === 0) {
        txts = surl;
      } else if (parseInt(data[e.msg.author.id].num) === 1) {
        if (surl.code == 200) {
          txts = surl.message;
        } else {
          txts = eoose + surl;
        }
      } else if (parseInt(data[e.msg.author.id].num) === 2) {
        if (surl.code == 0 && surl?.data?.[0]?.reply !== undefined) {
          txts = surl.data[0].reply;
        } else {
          txts = surl.msg || eoose + surl;
        }
      } else if (parseInt(data[e.msg.author.id].num) === 3) {
        if (surl.code == 200) {
          txts = surl.message;
        } else {
          txts = eoose + surl;
        }
      } else if (parseInt(data[e.msg.author.id].num) === 4) {
        if (surl.code == 200) {
          txts = surl.answer;
        } else {
          txts = eoose + surl;
        }
      } else if (parseInt(data[e.msg.author.id].num) === 5) {
        txts = surl;
      } else if (parseInt(data[e.msg.author.id].num) === 6) {
        if (surl.code == 200) {
          txts = surl.message;
        } else {
          txts = eoose + surl;
        }
      }
    }
    try {
      let durationInNanoseconds = process.hrtime(start);
      let durationInSeconds =
        durationInNanoseconds[0] + durationInNanoseconds[1] / 1e9;
      //计算时间
      let hours = Math.floor(durationInSeconds / 3600);
      let minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
      let seconds = Math.round(durationInSeconds - hours * 3600 - minutes * 60);
      let epct;
      if (parseInt(data[e.msg.author.id].num) === 0) {
        epct = await e.reply(txts);
      } else {
        epct = await e.reply(
          `接口${data[e.msg.author.id].num
          }:\n${txts}\n\n\n执行时长 ${hours} 时 ${minutes} 分 ${seconds} 秒\n共执行${data.school
          }次`
        );
      }
      if (!epct) {
        e.reply(`出错了:${JSON.stringify(epct)}`);
      }
    } catch (err) {
      console.error(err);
      e.reply(`出错了:${JSON.stringify(err)}`);
    }
    const updatedAt = Date.now();
    data[e.msg.author.id].COOLDOWN_TIME = COOLDOWN_TIME;
    data[e.msg.author.id].updatedAt = updatedAt;
    data.school++;
    jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(pathgpt, jsonData, "utf8");
    return false;
  }
  async appsetkey(e: Messagetype): Promise<boolean> {
    console.log("[appsetkey]", "任务触发");
    let num = 0;
    const state = {
      step: 0,
      data: e.cmd_msg,
      fnc: () => { },
    };
    const tsfzx = ["1:注册key\n", "2:重置key\n", "3:绑定微信\n", "4:找回key"];
    await e.reply(`请输入您的邮箱`);
    await setConversationState(e.msg.author.id, state);
    const callBack = async (e, state) => {
      if (num === 0) {
        email = e.cmd_msg;
        await e.reply(`邮箱是: ${e.cmd_msg}`);
        await e.reply(`请输入操作id\n${tsfzx.join("")}`);
        await setConversationState(e.msg.author.id, state);
        num++;
        return;
      } else if (num === 1) {
        if (e.cmd_msg >= 1 && e.cmd_msg <= 4) {
          opt = e.cmd_msg;
          await e.reply("id正确");
          let url = `https://api.a20safe.com/api.php?api=39&mail=${email}&opt=${opt}`;
          let surl = await fetchData(url);
          if (surl.data[0].result.includes("验证码")) {
            await e.reply(surl.data[0].result);
            num++;
            await setConversationState(e.msg.author.id, state);
            return;
          } else if (surl.data[0].result.includes("邮箱")) {
            await e.reply(surl.data[0].result);
          } else {
            e.reply("出错了");
          }
        } else {
          await e.reply(`id输入错误,请重新输入\n${tsfzx.join("")}`);
          return;
        }
      } else if (num === 2) {
        if (opt == 1) {
          code = e.cmd_msg;
          let url = `https://api.a20safe.com/api.php?api=47&mail=${email}&code=${code}`;
          let surl = await fetchData(url);
          if (surl.code == 0) {
            if (/^[0-9a-z]{32}$/i.test(surl.data[0].result)) {
              await e.reply(`您的密钥是：\n${surl.data[0].result}`);
            } else {
              await e.reply(surl.data[0].result);
            }
            data[e.user_id].a20key = surl.data[0].result;
            jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(pathgpt, jsonData, "utf8");
            await deleteConversationState(e.msg.author.id);
          } else {
            e.reply("出错了！");
          }
        } else if (opt == 2) {
          code = e.cmd_msg;
          let url = `https://api.a20safe.com/api.php?api=46&mail=${email}&code=${code}`;
          let surl = await fetchData(url);
          if (surl.code == 0) {
            if (/^[0-9a-z]{32}$/i.test(surl.data[0].result)) {
              await e.reply(`您的密钥是：\n${surl.data[0].result}`);
            } else {
              await e.reply(surl.data[0].result);
            }
            data[e.user_id].a20key = surl.data[0].result;
            jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(pathgpt, jsonData, "utf8");
            await deleteConversationState(e.msg.author.id);
          } else {
            e.reply("出错了！");
          }
        } else if (opt == 3) {
          e.reply(`暂不支持,请重新输入\n${tsfzx.join("")}`);
          return;
        } else if (opt == 4) {
          code = e.cmd_msg;
          let url = `https://api.a20safe.com/api.php?api=45&mail=${email}&code=${code}`;
          let surl = await fetchData(url);
          if (surl.code == 0) {
            if (/^[0-9a-z]{32}$/i.test(surl.data[0].result)) {
              await e.reply(`您的密钥是：\n${surl.data[0].result}`);
            } else {
              await e.reply(surl.data[0].result);
            }
            data[e.user_id].a20key = surl.data[0].result;
            jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(pathgpt, jsonData, "utf8");
            await deleteConversationState(e.msg.author.id);
          } else {
            e.reply("出错了！");
          }
        }
      }
      await deleteConversationState(e.msg.author.id);
      await e.reply(`结束`);
    };
    conversationHandlers.set(e.msg.author.id, callBack);
    return false;
  }
}
// 判断是否处于冷却状态
function isCooldown(userId) {
  if (data[userId]) {
    const elapsed = Date.now() - data.updatedAt;
    return elapsed < COOLDOWN_TIME;
  } else {
    return false;
  }
}
async function fetchData(url) {
  let data;
  const response = await fetch(url);
  try {
    data = await response.json();
  } catch {
    try {
      data = await response.text();
    } catch (error) {
      console.error("请求错误：", error);
      data = "请求错误";
    }
  }
  console.log(data);
  return data;
}
