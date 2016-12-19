/* 
 * Urban Dictionary API
 * Uses Mashape
 * 
 * Designed by Dmitry Lukashevich a.k.a. Dembel
 */

"use strict";

const MASHAPE_KEY = require("../credentials").MASHAPE_KEY;
const https = require("https");
const querystring = require("querystring");
const logger = require("../logger");

//********** local helpers **********
const getVocab = () => {
  const config = require("../config.json");

  return config.lang === "en" ?
    require("../vocabulary/urbandefVocab.json").en:
    require("../vocabulary/urbandefVocab.json").ru;
};

const constructMsg = (phrase, data) => {
  return data.result_type === "no_results" ?
    getVocab().NOT_FOUND : getVocab().DEFINITION_OF + phrase + ":\n\n" +
    data.list.filter(val => val.definition.length < 600).
    map(val => "||| " + val.definition).join("\n");
};
//********** commands **********
const urbandef = (data, cb) => {
  const [cmd, phrase] = data;
  if (!phrase) {
    cb([cmd, getVocab().EMPTY_QUERY]);
    return;
  }
  const REQ_OPTIONS = {
    hostname: "mashape-community-urban-dictionary.p.mashape.com",
    path: "/define?" + querystring.stringify({term: phrase}),
    headers: {
      "X-Mashape-Key": MASHAPE_KEY,
      "Accept": "application/json"
    }
  };
  const req = https.request(REQ_OPTIONS, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {
      cb([cmd, constructMsg(phrase, JSON.parse(fullRes))]);
    });

    res.on("error", err => {
      logger.log("error", err);
    });
  });

  req.end()
  req.on("error", error => {
    logger.log("error", err);
  });
};

module.exports = urbandef;