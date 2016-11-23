/*
 * Language Tool API for spell checking
 * Uses Mashape
 */

"use strict";

const MASHAPE_KEY = require("../../credentials").MASHAPE_KEY;
const https = require("https");
const vkapi = require("../../apis/vkapi");
const helpers = require("../../helpers");
const querystring = require("querystring");

//********** messages **********
const NO_ERROR_EN = "Everything seems to be correct";
const NO_ERROR_RU = "Предлагаемый текст не содержит ошибок";
const ON_ERROR = "Oh, shoot! I'm tired of that shit"; //TODO: move it to single file

//********** local helpers **********
const constructMsg = (phrase, data) => {
  return data.matches.length ?
    data.matches.reduce((acc, val)  => acc.replace(
      phrase.substr(val.offset, val.length),
      "(" + val.replacements.map(val => val.value).join(", ") + ")"
    ), phrase) : NO_ERROR_RU; 
};

//********** commands **********
const spellcheck = (cmd, phrase) => {
  const REQ_OPTIONS = {
    hostname: "dnaber-languagetool.p.mashape.com",
    path: "/v2/check",
    method: "POST",
    headers: {
      "X-Mashape-Key": MASHAPE_KEY,
      "Content-Type": "application/x-www-form-urblencoded",
      "Accept": "application/json"
    }
  };
  const REQ_BODY = {
    language: helpers.detectLanguage(phrase) === "ru"? "ru-RU" : "en-US",
    text: phrase
  }
  const req = https.request(REQ_OPTIONS, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {
      if (!fullRes.Error) {
        vkapi.sendMessage(cmd, constructMsg(phrase, JSON.parse(fullRes)));
      } else {
        vkapi.sendMessage(cmd, ON_ERROR);
      };
    });
  });

  req.write(querystring.stringify(REQ_BODY));
  req.end();

  req.on("error", err => {
    vkapi.sendMessage(cmd, ON_ERROR);
  });
};

module.exports = spellcheck;