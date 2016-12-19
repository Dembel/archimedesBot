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
const logger = require("../logger");

//********** local helpers **********
const getVocab = () => {
  const config = require("../config.json");

  return config.lang === "en" ?
    require("../vocabulary/spellcheckVocab.json").en:
    require("../vocabulary/spellcheckVocab.json").ru;
};

const constructMsg = (phrase, data) => {
  return data.matches.length ?
    getVocab().SPELL_ERROR + data.matches.reduce((acc, val)  => acc.replace(
      phrase.substr(val.offset, val.length),
      "(" + val.replacements.map(val => val.value).join(", ") + ")"
    ), phrase) : getVocab().NO_ERROR; 
};

//********** commands **********
const spellcheck = (data, cb) => {
  const [cmd, phrase] = data;
  if (!phrase) {
    cb([cmd,getVocab().EMPTY_QUERY]);
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
        logger.log("error", err);
      };
    });
  });

  req.write(querystring.stringify(REQ_BODY));
  req.end();

  req.on("error", err => {
    logger.log("error", err);
  });
};

module.exports = spellcheck;