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
  const cmd = data[0];
  const msg = data[1];
  const lang = helpers.detectLanguage(msg) === "ru" ? "lang_ru" : "lang_en";
  const URIString = "www.google.com/search?lr=" + lang +
    "&q=" + msg.split(" ").join("\+");
  
  cb([cmd, URIString]);
};

module.exports = google;