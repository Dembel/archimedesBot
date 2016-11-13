/*
 * !G or !Google command module
 */

"use strict"

const vkapi = require("../apis/vkapi");

//********** Helpers **********
const detectLanguage = text => {
  const RU = ["а","б","в","г","д","е","ё","ж","з","и","й","к","л","м","н","о",
              "п","р","с","т","у","ф","х","ц","ч","ш","щ","ъ","ы","ь","э","ю",
              "я"];
  const cleanText = text.split("").filter(val => isNaN(Number(val)));

  return RU.indexOf(cleanText[0].toLowerCase()) >= 0 ? "ru" : "en";
};

// !google command
const google = (cmd, msg) => {
  const lang = detectLanguage(msg) === "ru" ? "lang_ru" : "lang_en";
  const URIString = "www.google.com/search?lr=" + lang +
    "&q=" + msg.split(" ").join("\+");
  
  vkapi.sendMessage(cmd, URIString);
};

module.exports = google;