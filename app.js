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

const run = () => {
  const vkapi = require("./vkapi");
  const commands = require("./commands/commandList");

  // command executor
  const execCmd = msg => {
    const cmd = msg.body.match(/^!\S+/);
    const cmdText = cmd ? msg.body.slice(cmd[0].length + 1).trim() : null;
    const data = [msg, cmdText];

    // mark this message as read so as to not read it twice
    vkapi.markAsRead(msg.mid);
    // if command is recognized, execute
    if (commands[cmd]) {
      commands[cmd](data, function (res) {
        vkapi.sendMessage(res);
      });
    }
  };

  (function mainLoop() {
    // randomize delay for response so it's not that obvious we are using bot
    const max = 3500;
    const min = 2000;
    const resDelay = Math.floor(Math.random() * (max - min) + min); 

    vkapi.getMessages(execCmd);
    setTimeout(mainLoop, resDelay);
  }());
};

require("./init")(run);