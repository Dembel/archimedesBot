/*
 * Info bot for VK chats
 * Designed by Dmitry Lukashevich
 */
"use strict";

const CREDENTIALS = require("./credentials");
const https = require("https");
const url = require("url");

const sendRequest = options => {
  const req = https.request(options, res => {
    var fullRes = "";

    res.setEncoding("utf-8");
    res.on("data", data => {
      fullRes += data;
    });

    res.on("end", () => {
      JSON.parse(fullRes).response.forEach((val, i) => console.log(i > 0 ? val.body : ""));
    });
  });

  req.end();
};

const sendMessage = (chat, message) => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.send?user_id=225947793&" +
      "chat_id=394315580&message=" + message + 
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  });
};

const isTyping = () => {
  sendRequest({
    hostname: "api.vk.com",
    path: "/method/messages.setActivity?user_id=225947793&" +
      "type=typing" +
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  });
};

const getMessages = () => {
  const OPTIONS = {
    hostname: "api.vk.com",
    path: "/method/messages.get?out=0&=225947793" +
      "&access_token=" + CREDENTIALS.ACCESS_TOKEN
  };

    const req = https.request(OPTIONS, res => {
    var fullRes = "";

    res.setEncoding("utf-8");
    res.on("data", data => {
      fullRes += data;
    });

    res.on("end", () => {
      JSON.parse(fullRes).response.forEach((val, i) => {
        
        //checkForCommand(i > 0 ? val.body : "!dummy");
      });
    });
  });

  req.end();
};

const google = text => {
  sendMessage(1, "www.google.com/search?q=" + text.replace(" ", "+"));
};

const checkForCommand = (command) => {
  const COMMAND_LIST = {
    "!google": google
  };

  const finalCmd = command.match(/^!\S+/);
  const cmdText = finalCmd ? command.slice(finalCmd[0].length + 1) : null;
  const funName = finalCmd ? finalCmd[0].replace("!", "") : null; 

  if (COMMAND_LIST[finalCmd]) {
    COMMAND_LIST[finalCmd](cmdText);
  }
};

//isTyping();
//setTimeout(sendMessage, 7000);
const mainLoop = () => {
  getMessages();
  setTimeout(mainLoop, 2000);
};

mainLoop();





