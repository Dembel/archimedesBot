const chai = require("chai");
const expect = chai.expect;
const urbandef = require("../commands/urbandef");
const config = require("../config.json");
const initialLang = config.lang;
const fs = require("fs");

describe("Urbandef module tests", function () {
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

  it("should return Empty query. Try !help urbandef", done => {
    urbandef([null, ""], data => {
      expect(data[1]).to.contain("Empty query. Try !help urbandef");
      done();
    });
  });
});