/* 
 * Merriam Webster Dictionary API 
 */

"use strict";

const MERIAM_KEY = require("../../credentials").MERIAM_KEY;
const https = require("https");
const vkapi = require("../../apis/vkapi");

const constructRequest = json => {
  const entry = json.entry_list.entry;
  const nums = entry[0].def[0].sn;

  console.log(entry[0].def[0].dt.map((val, i) =>
    typeof val === "string" ?
       val.replace(/:|as$/g, "").trim() :
       val._ && val._.replace(/\s/g, "") !== ":" ?
         val._.trim() : "").filter(val => val));
};

const def = (cmd, word) => {
  const REQ_OPTIONS = {
    hostname: "dictionaryapi.com",
    path: "/api/v1/references/collegiate/xml/" + word.split(" ")[0] +
      "?key=" + CREDENTIALS.DICTIONARY_KEY
  }

  const req = http.request(REQ_OPTIONS, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {
      require("xml2js").parseString(fullRes, (err, result) => {
        if (!err) constructRequest(result);
      });
    });
  });

  req.end()
  req.on("error", error => {
    
  });
};

module.exports = def;