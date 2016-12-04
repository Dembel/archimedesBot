/*
 * !Google command module
 * Performs google search
 * 
 * Designed by Dmitry Lukashevich a.k.a Dembel
 */

"use strict"

const helpers = require("../helpers");

// !google command
const google = (data, cb) => {
  const [cmd, msg] = data;
  if (msg) {
    const lang = helpers.detectLanguage(msg) === "ru" ? "lang_ru" : "lang_en";
    const result = "www.google.com/search?lr=" + lang +
    "&q=" + msg.split(" ").join("\+");

    cb([cmd, result]);
  } else {
    cb([cmd, "Empty search query. Try !help google"]);
  }
};

module.exports = google;