/*
 * !G or !Google command module
 */

"use strict"

const vkapi = require("../apis/vkapi");
const helpers = require("../helpers");

// !google command
const google = (cmd, msg) => {
  const lang = helpers.detectLanguage(msg) === "ru" ? "lang_ru" : "lang_en";
  const URIString = "www.google.com/search?lr=" + lang +
    "&q=" + msg.split(" ").join("\+");
  
  vkapi.sendMessage(cmd, URIString);
};

module.exports = google;