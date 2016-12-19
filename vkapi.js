/*
 * API for VK
 * 
 * Designed by Dmitry Lukashevich a.k.a. Dembel
 */

"use strict"

const ACCESS_TOKEN = require("./credentials").ACCESS_TOKEN;
const https = require("https");
const querystring = require("querystring");
const logger = require("./logger");

//********** Helpers **********
const sendRequest = options => {
  const req = https.request(options, res => {
    res.on("error", err => {
      logger.log("error", err);
    });
  });

  req.end();
  req.on("error", err => {
    logger.log("error", err);
  });
};

const saveCaptcha = (img, sid) => {
  require("fs").writeFileSync("./captcha_" + sid + ".jpg", img);
};

const getCaptcha = (options, sid) => {
  const req = https.request(options, res => {
    var img = Buffer.alloc(0);

    res.on("data", data => {
      img = Buffer.concat([img, data], img.length + data.length);
    });
    res.on("end", () => {
      saveCaptcha(img);
    });
    res.on("error", err => {
      logger.log("error", err);      
    });
  });

  req.end();
  req.on("error", err => {
      logger.log("error", err);
  });
};

//********** API methods **********//
//********** Private **********//
// message.type request
const isTyping = uid => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.setActivity?user_id=" + uid +
      "&type=typing&access_token=" + ACCESS_TOKEN
  });
};

//********** Public **********
// message.send request
const sendMessage = msg => {
  const [cmd, message] = msg;
  const id = cmd.chat_id === undefined ?
    "user_id=" + cmd.uid  : "chat_id=" + cmd.chat_id;

  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.send?" + id + "&" +
      querystring.stringify({message: message}) +
      "&access_token=" + ACCESS_TOKEN
  });
};
// message.markAsRead request
const markAsRead = mid => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.markAsRead?message_ids=" + mid +
      "&access_token=" + ACCESS_TOKEN
  });
};
// message.get request
const getMessages = callback => {
  const OPTIONS = {
    hostname: "api.vk.com",
    path: "/method/messages.get?count=10" +
      "&access_token=" + ACCESS_TOKEN
  };

  const req = https.request(OPTIONS, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });
    res.on("end", () => {
      const msgs = JSON.parse(fullRes);

      if (msgs.response) {
        msgs.response.filter(val => {
          if (val.body) {
            return val.read_state === 0;
          } else {
            return false;
          }
        }).forEach(val => callback(val));
      } else if (msgs.error.error_msg === "Captcha needed") {
        getCaptcha({
          hostname: "api.vk.com",
          path: "/captcha.php?sid=" + msgs.error.captcha_sid
        }, msgs.error.captcha_sid);
      } else {
        logger.log("error", msgs.error.error_msg);
      }
    });
    res.on("error", err => {
      logger.log("error", err);      
    });
  });
  
  req.end();
  req.on("error", err => {
    logger.log("error", err);
  });
};
// message.editChat request
const title = (data, cb) => {
  const [chat, chatTitle] = data;

  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.editChat?chat_id=" + chat.chat_id + "&" +
      querystring.stringify({title: chatTitle}) +
      "&access_token=" + ACCESS_TOKEN
  });
  cb([chat, null]);
};
// account.setOnline request
const setOnline = () => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/account.setOnline?access_token=" + ACCESS_TOKEN
  });
};
// account.setOffline request
const setOffline = () => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/account.setOffline?access_token=" + ACCESS_TOKEN
  });
};

module.exports = {
  title: title,
  getMessages: getMessages,
  markAsRead: markAsRead,
  sendMessage: sendMessage,
  setOnline: setOnline,
  setOffline: setOffline
};