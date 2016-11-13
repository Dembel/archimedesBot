/* 
 * Urban Dictionary API
 */

"use strict";

const MASHAPE_KEY = require("../../credentials").MASHAPE_KEY;
const https = require("https");
const vkapi = require("../../apis/vkapi");
const querystring = require("querystring");

//********** messages **********
const NOT_FOUND = "Don't know such thing. Check your damn spelling";
const ON_ERROR = "Oh, shoot! I'm tired of that shit";

//********** commands **********
const urbandef = (cmd, word) => {
  const firstWord = word.split(" ")[0];

  const REQ_OPTIONS = {
    hostname: "mashape-community-urban-dictionary.p.mashape.com",
    path: "/define?" + querystring.stringify({term: word.trim()}),
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
      fullRes = JSON.parse(fullRes);
      const msg = fullRes.result_type === "no_results" ?
        NOT_FOUND : "Definition of " + word + ":\n\n" +
        fullRes.list.filter(val => val.definition.length < 600).
        map(val => "||| " + val.definition).join("\n");

      vkapi.sendMessage(cmd, msg);
    });
  });

  req.end()
  req.on("error", error => {
    vkapi.sendMessage(cmd, ON_ERROR);
  });
};

module.exports = urbandef;