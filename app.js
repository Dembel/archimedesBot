/*
 * Info bot for VK chats
 * Designed by Dmitry Lukashevich
 * 
 * Command list:
 * -- !google or !g google search query - sends the link to google page 
 * with your search query results. (implemented)
 * -- !title of !t text - changes the title of a chat (implemented)
 * -- !weather city - returns the link to rp5 page containing forecast for 
 * your city (not implemented)
 */
"use strict";

const CREDENTIALS = require("./credentials");
const https = require("https");
const url = require("url");
const querystring = require("querystring");

//********** Helpers **********
const sendRequest = options => {
  const req = https.request(options, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {

    });
  });

  req.end();
};

const detectLanguage = text => {
  const RU = ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о",
              "п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю",
              "я"];
  const cleanText = text.split("").filter(val => isNaN(Number(val)));

  return RU.indexOf(cleanText[0].toLowerCase()) >= 0 ? "ru" : "en";
};
//********** API methods **********//
// message.send request
const sendMessage = (cmd, message) => {
  const id = cmd.chat_id === undefined ?
    "user_id=" + cmd.uid  : "chat_id=" + cmd.chat_id;

  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.send?" + id + "&" +
      querystring.stringify({message: message}) +
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  });
};
// message.type request
const isTyping = uid => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.setActivity?user_id=" + uid +
      "&type=typing&access_token=" + CREDENTIALS.ACCESS_TOKEN
  });
};
// message.markAsRead request
const markAsRead = mid => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.markAsRead?message_ids=" + mid +
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  });
};
// message.get request
const getMessages = () => {
  const OPTIONS = {
    hostname: "api.vk.com",
    path: "/method/messages.get?count=10" +
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  };

  const req = https.request(OPTIONS, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {
      const msgs = JSON.parse(fullRes).response;

      msgs.filter(val => val.body ? val.read_state === 0 : false).
        forEach(val => execCmd(val));
    });

  });
  
  req.end();
};
// message.editChat request
const title = (chat, chatTitle) => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.editChat?chat_id=" + chat.chat_id + "&" +
      querystring.stringify({title: chatTitle}) +
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  });
};
//********** Commands **********//
// !google command
const google = (cmd, msg) => {
  const lang = detectLanguage(msg) === "ru" ? "lang_ru" : "lang_en";
  const URIString = "www.google.com/search?lr=" + lang +
    "&q=" + msg.split(" ").join("\+");
  
  isTyping(cmd.uid);
  setTimeout(() => {
    sendMessage(cmd, URIString);
  }, 2000);
};

const execCmd = msg => {
  const COMMAND_LIST = {"!google": google, "!g": google,
                        "!title": title, "!t": title};
  const cmd = msg.body.match(/^!\S+/);
  const cmdText = cmd ? msg.body.slice(cmd[0].length + 1) : null;

  // if command, execute
  if (COMMAND_LIST[cmd]) {
    COMMAND_LIST[cmd](msg, cmdText);
  }
  // mark this message as read so as to not read it twice
  markAsRead(msg.mid);
};

(function mainLoop() {
  getMessages();
  setTimeout(mainLoop, 2000);
}());