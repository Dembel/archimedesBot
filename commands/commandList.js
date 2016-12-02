/*
 * List of available commands
 * Add your custom command here
 */

"use strict";

const vkapi = require("../vkapi");
const urbandef = require("../commands/urbandef");
const google = require("../commands/google");
const spellcheck = require("../commands/spellcheck");
const calc = require("./calc");

const COMMANDS = {
  "!commands": commands, "!google": google, "!title": vkapi.title,
  "!urbandef": urbandef, "!spellcheck": spellcheck, "!calc": calc
};

// list all available commands
function commands(data, cb) {
  const cmd = data[0];
  const body = data[1];
  const msg = "List of commands:\n" + Object.keys(COMMANDS).join(", ");

  cb([cmd, msg]);
};

module.exports = COMMANDS;