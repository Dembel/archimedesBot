/*global  */
/*
 * Info bot for vkontakte
 * Designed by Dmitry Lukashevich a.k.a. Dembel
 * 
 * Command list:
 * -- !google google search query - sends the link to google page 
 * with your search query results. (implemented)
 * 
 * -- !title text - changes the title of a chat (implemented)
 * 
 * -- !urbandef word - gives you a definition of the word 
 * from Urban Dictionary (implemented)
 * 
 * -- !def word - gives you a definition of the word from Merriam Webster
 * (not implemented)
 * 
 * -- !spellcheck or !scheck- spell-checks a word or text 
 * using Language Tool.org API (implemented)
 * 
 * -- !commands - gives the list of available commands (implemented)
 * 
 * -- !calc expression - calculator (implemented)
 * 
 * -- !weather city - returns the link to rp5 page containing forecast for 
 * your city (not implemented)
 * 
 */
"use strict";
const vkapi = require("./vkapi");
const logger = require("./logger");

// command executor
const execCmd = msg => {
  const commands = require("./commands/commandList");
  const cmd = msg.body.match(/^!\S+/);
  const cmdText = cmd ? msg.body.slice(cmd[0].length + 1).trim() : null;
  const data = [msg, cmdText];

  // if command is recognized, execute
  if (commands[cmd] && cmdText != null) {
    commands[cmd](data, res => {
      vkapi.sendMessage(res);
    });
  }
  // mark this message as read so as to not read it twice
  vkapi.markAsRead(msg.mid);
};

// set bot online
const onlineStatusLoop = () => {
  vkapi.setOnline();
  setTimeout(onlineStatusLoop, 60000);
};

const mainLoop = () => {
  vkapi.getMessages(execCmd);
  setTimeout(mainLoop, 2000);
};

const run = () => {
  mainLoop();
  onlineStatusLoop();
};

// set bot offline on error or exit and log an error if there's one
const finish = err => {
  vkapi.setOffline();
  if (err) {
    logger.log("error", err);
    console.log(err);
  }
  process.exit();
};
process.on("uncaughtException", finish);
process.on("SIGINT", finish);

require("./init")(run);