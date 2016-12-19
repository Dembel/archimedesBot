"use strict";

const help = (data, cb) => {
  const config = require("../config.json");
  const helpVocab = config.lang === "en" ?
    require("../vocabulary/helpVocab.json").en:
    require("../vocabulary/helpVocab.json").ru;
  const [cmd, phrase] = data;
  const result = helpVocab[phrase];

  if (result) {
    cb([cmd, result]);
  } else {
    cb([cmd, helpVocab.noCommand]);
  }
};

module.exports = help;