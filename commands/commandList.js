/*
 * List of available commands
 */

"use strict";

const vkapi = require("../apis/vkapi");
const urbandef = require("../commands/dictionaries/urbandef");
const google = require("../commands/google");
const spellcheck = require("../commands/dictionaries/spellcheck");
const calc = require("./calc");

const COMMANDS = {
  "!google": google, "!g": google, "!title": vkapi.title, "!t": vkapi.title,
  "!urbandef": urbandef, "!udef": urbandef, "!spellcheck": spellcheck,
  "!scheck": spellcheck, "!calc": calc, "!commands": commands
};

// list all available commands
function commands(cmd) {
  const msg = Object.keys(COMMANDS).join("  ").replace("  !commands", "");

  vkapi.sendMessage(cmd, msg);
};

module.exports = COMMANDS;