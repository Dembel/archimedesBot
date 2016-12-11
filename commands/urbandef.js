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

//********** messages **********
const NOT_FOUND = "Don't know such thing. Check your damn spelling";
const ON_ERROR = "Oh, shoot! I'm tired of that shit";//TODO. Make lang file

//********** local helpers **********
const constructMsg = (phrase, data) => {
  return data.result_type === "no_results" ?
    NOT_FOUND : "Definition of " + phrase + ":\n\n" +
    data.list.filter(val => val.definition.length < 600).
    map(val => "||| " + val.definition).join("\n");
};
//********** commands **********
const urbandef = (data, cb) => {
  const [cmd, phrase] = data;
  if (!phrase) {
    cb([cmd, "Empty query. Try !help urbandef"]);
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
  });

  req.end()
  req.on("error", error => {
    cb([cmd, ON_ERROR]);
  });
};

module.exports = urbandef;