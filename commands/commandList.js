/*
 * List of available commands
 * Add your custom command here
 */

"use strict";

const vkapi = require("../vkapi");
const urbandef = require("./urbandef");
const google = require("./google");
const spellcheck = require(".//spellcheck");
const help = require("./help");
const calc = require("./calc");


const COMMANDS = {
  "!commands": commands, "!google": google, "!title": vkapi.title,
  "!urbandef": urbandef, "!spellcheck": spellcheck, "!calc": calc,
  "!help": help
};

// list all available commands
function commands(data, cb) {
  const config = require("../config.json");
  const cmdListVocab = config.lang === "en" ?
    require("../vocabulary/cmdListVocab.json").en :
    require("../vocabulary/cmdListVocab.json").ru;
  const [cmd, body] = data;
  const msg = cmdListVocab + Object.keys(COMMANDS).join(", ");

  cb([cmd, msg]);
};

module.exports = COMMANDS;