const chai = require("chai");
const expect = chai.expect;
const spellcheck = require("../commands/spellcheck");
const config = require("../config.json");
const initialLang = config.lang;
const fs = require("fs");

describe("Spellcheck module tests", () => {
  let newConf = config;

  before(() => {
    newConf.lang = "en";
    fs.writeFileSync("./config.json",
                     JSON.stringify(newConf, false, 2));

  });
  after(() => {
    newConf.lang = initialLang;
    fs.writeFileSync("./config.json",
                     JSON.stringify(newConf, false, 2));
  });

  it("should return Empty query. Try !help spellcheck", done => {
    spellcheck([null, ""], data => {
      expect(data[1]).
        to.equal("Empty query. Try !help spellcheck");
      done();
    });
  });
});