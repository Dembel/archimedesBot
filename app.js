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
 * -- !urbandef word - gives you a definition of the word 
 * from Urban Dictionary (implemented)
 */
"use strict";

const vkapi = require("./apis/vkapi");
const urbandef = require("./commands/dictionaries/urbandef");
const google = require("./commands/google");

// command executor
const execCmd = msg => {
  const COMMAND_LIST = {"!google": google, "!g": google,
                        "!title": vkapi.title, "!t": vkapi.title,
                        "!urbandef": urbandef};
  const cmd = msg.body.match(/^!\S+/);
  const cmdText = cmd ? msg.body.slice(cmd[0].length + 1).trim() : null;

  // if command is recognized, execute
  if (COMMAND_LIST[cmd]) {
    COMMAND_LIST[cmd](msg, cmdText);
  }
  // mark this message as read so as to not read it twice
  vkapi.markAsRead(msg.mid);
};

(function mainLoop() {
  vkapi.getMessages(execCmd);
  setTimeout(mainLoop, 2000);
}());