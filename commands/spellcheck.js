/*
 * Language Tool API for spell checking
 * Uses Mashape
 * 
 * Designed by Dmitry Lukashevich a.k.a. Dembel
 */

"use strict";

const MASHAPE_KEY = require("../credentials").MASHAPE_KEY;
const https = require("https");
const helpers = require("../helpers");
const querystring = require("querystring");

//********** messages **********
 //TODO. Make lang file for messages
const NO_ERROR_EN = "Everything seems to be correct";
const NO_ERROR_RU = "Предлагаемый текст не содержит ошибок";
const SPELL_ERROR_EN = "There are some errors, possible answers are in parens:";
const SPELL_ERROR_RU = "В тексте имеются ошибки, варианты исправления" +
  " предоставлены в скобках";
const ON_ERROR = "Oh, shoot! I'm tired of that shit";

//********** local helpers **********
const constructMsg = (phrase, data) => {
  return data.matches.length ?
    "There are some errors, possible answers are in parens:\n\n" +
    data.matches.reduce((acc, val)  => acc.replace(
      phrase.substr(val.offset, val.length),
      "(" + val.replacements.map(val => val.value).join(", ") + ")"
    ), phrase) : NO_ERROR_EN; 
};

//********** commands **********
const spellcheck = (data, cb) => {
  const [cmd, phrase] = data;
  if (!phrase) {
    cb([cmd,"Empty query. Try !help spellcheck"]);
    return;
  }
  const REQ_OPTIONS = {
    hostname: "dnaber-languagetool.p.mashape.com",
    path: "/v2/check",
    method: "POST",
    headers: {
      "X-Mashape-Key": MASHAPE_KEY,
      "Content-Type": "application/x-www-form-urlencoded",
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
        cb([cmd, constructMsg(phrase, JSON.parse(fullRes))]);
      } else {
        cb([cmd, ON_ERROR]);
      };
    });
  });

  req.write(querystring.stringify(REQ_BODY));
  req.end();

  req.on("error", err => {
    cb([cmd, ON_ERROR]);
  });
};

module.exports = spellcheck;