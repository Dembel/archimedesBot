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
  const config = require("../config.json");
  const vocab = config.lang === "en" ?
    require("../vocabulary/googleVocab.json").en:
    require("../vocabulary/googleVocab.json").ru;
  const [cmd, msg] = data;

  if (msg) {
    const lang = helpers.detectLanguage(msg) === "ru" ? "lang_ru" : "lang_en";
    const result = "www.google.com/search?lr=" + lang +
    "&q=" + msg.split(" ").join("\+");

    cb([cmd, result]);
  } else {
    cb([cmd, vocab]);
  }
};

module.exports = google;