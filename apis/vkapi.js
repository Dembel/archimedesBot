/*
 * API for VK
 */

"use strict"

const ACCESS_TOKEN = require("../credentials").ACCESS_TOKEN;
const https = require("https");
const querystring = require("querystring");

//********** Helpers **********
const sendRequest = options => {
  const req = https.request(options, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
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
const sendMessage = (cmd, message) => {
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
      const msgs = JSON.parse(fullRes).response;

      msgs.filter(val => val.body ? val.read_state === 0 : false).
        forEach(val => callback(val));
    });
  });
  
  req.end();
  req.on("error", error => {
    throw error;
  });
};
// message.editChat request
const title = (chat, chatTitle) => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.editChat?chat_id=" + chat.chat_id + "&" +
      querystring.stringify({title: chatTitle}) +
      "&access_token=" + ACCESS_TOKEN
  });
};

module.exports = {
  title: title,
  getMessages: getMessages,
  markAsRead: markAsRead,
  sendMessage: sendMessage
}