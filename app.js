/*
 * Info bot for social networks
 * Designed by Dmitry Lukashevich
 * 
 * Command list:
 * -- !google or !g google search query - sends the link to google page 
 * with your search query results. (implemented)
 * 
 * -- !title or !t text - changes the title of a chat (implemented)
 * 
 * -- !urbandef or !udef word - gives you a definition of the word 
 * from Urban Dictionary (implemented)
 * 
 * -- !def word - gives you a definition of the word from Merriam Webster
 * 
 * -- !spellcheck or !scheck- spell-checks a word or text 
 * using Language Tool.org API (implemented)
 * 
 * -- !commands - gives the list of available commands (implemented)
 * 
 * -- !calc expression - calculator (not implemented)
 * 
 * -- !weather city - returns the link to rp5 page containing forecast for 
 * your city (not implemented)
 * 
 */
"use strict";

const run = () => {
  const vkapi = require("./apis/vkapi");
  const commands = require("./commands/commandList");

  // command executor
  const execCmd = msg => {
    const cmd = msg.body.match(/^!\S+/);
    const cmdText = cmd ? msg.body.slice(cmd[0].length + 1).trim() : null;

    // if command is recognized, execute
    if (commands[cmd]) {
      commands[cmd](msg, cmdText);
    }
    // mark this message as read so as to not read it twice
    vkapi.markAsRead(msg.mid);
  };

  (function mainLoop() {
    vkapi.getMessages(execCmd);
    setTimeout(mainLoop, 2000);
  }());
};

require("./init")(run);