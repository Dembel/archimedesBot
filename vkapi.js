/*
 * API for VK
 * 
 * Designed by Dmitry Lukashevich a.k.a. Dembel
 */

"use strict"

const ACCESS_TOKEN = require("./credentials").ACCESS_TOKEN;
const https = require("https");
const querystring = require("querystring");

//********** Helpers **********
const sendRequest = options => {
  const req = https.request(options, res => { });

  req.end();
  req.on("error", error => {
    throw error;
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
  });

  req.end();
  req.on("error", error => {
    throw error;
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
        msgs.response.filter(val => val.body ? val.read_state === 0 : false).
          forEach(val => callback(val));
      } else if (msgs.error.error_msg === "Captcha needed") {
        getCaptcha({
          hostname: "api.vk.com",
          path: "/captcha.php?sid=" + msgs.error.captcha_sid
        }, msgs.error.captcha_sid);
      } else {
        throw new Error(msgs.error.error_msg);
      }
    });
  });
  
  req.end();
  req.on("error", error => {
    throw error;
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
  cb([chat, "As you wish"]);
};

module.exports = {
  title: title,
  getMessages: getMessages,
  markAsRead: markAsRead,
  sendMessage: sendMessage
}