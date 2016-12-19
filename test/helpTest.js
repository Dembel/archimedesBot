const chai = require("chai");
const expect = chai.expect;
const help = require("../commands/help");
const config = require("../config.json");
const initialLang = config.lang;
const fs = require("fs");

describe("Help module tests", () => {
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

  it("should return !help usage:\\n type " +
     "!help and command name \n w/o exclamation mark.\\n " +
     "Example: !help urbandef", done => {
    help([null, ""], data => {
      expect(data[1]).
        to.equal("!help usage:\n type " +
                 "!help and command name w/o exclamation mark.\n " +
                 "Example: !help urbandef");
      done();
    });
  });
  it("should return !commands: returns the list of available " +
     "commands", done => {
    help([null, "commands"], data => {
      expect(data[1]).
        to.equal("!commands: returns the list of available " +
                 "commands");
      done();
    });
  });
  it("should return !google: returns the link to google search" +
     " results page.\\n\n Usage: !google <your search query>.\\n" +
     " Example: !google foo bar", done => {
    help([null, "google"], data => {
      expect(data[1]).
        to.equal("!google: returns the link to google search" +
                 " results page.\n Usage: !google <your search query>.\n" +
                 " Example: !google foo bar");
      done();
    });
  });
  it("should return !title: changes the title of conversation\\n\n" +
     " Usage: !title <new title>\\n Example: !title foobar", done => {
    help([null, "title"], data => {
      expect(data[1]).
        to.equal("!title: changes the title of conversation\n" +
                 " Usage: !title <new title>\n Example: !title foobar");
      done();
    });
  });
  it("should return !urbandef: sends request of your word or phrase\n" +
     " to urban dictionary and returns its definition" +
     " (English only).\\n\n Usage: !urbandef <your word|phrase>\\n\n" +
     " Examples: !urbandef pine | !urbandef pull one's leg", done => {
    help([null, "urbandef"], data => {
      expect(data[1]).
        to.equal("!urbandef: sends request of your word or phrase" +
                 " to urban dictionary and returns its definition" +
                 " (English only).\n Usage: !urbandef <your word|phrase>\n" +
                 " Examples: !urbandef pine | !urbandef pull one's leg");
      done();
    });
  });
  it("should return !spellcheck: spellchecks your word|phrase and\n" +
     " returns same word|phrase with possible corrections in parens.\\n\n" +
     " Usage: !spellcheck <your word|phrase>.\\n\n" +
     " Examples: !spellcheck foobar | !spellcheck foo bar foobar", done => {
    help([null, "spellcheck"], data => {
      expect(data[1]).
        to.equal("!spellcheck: spellchecks your word|phrase and" +
                 " returns same word|phrase with possible corrections" +
                 " in parens.\n" +
                 " Usage: !spellcheck <your word|phrase>.\n" +
                 " Examples: !spellcheck foobar | !spellcheck foo bar foobar");
      done();
    });
  });
  it("should return !calc: calculator - calculates your expression.\n" +
     " You can use * / + - ^, parens, and negative numbers\n" +
     " in your expression.\\n Usage: !calc <your expression>.\\n\n" +
     " Example: !calc (-12 + 7) * 24 / (16 - 8)", done => {
    help([null, "calc"], data => {
      expect(data[1]).
        to.equal("!calc: calculator - calculates your expression." +
                 " You can use * / + - ^, parens, and negative numbers" +
                 " in your expression.\n Usage: !calc <your expression>.\n" +
                 " Example: !calc (-12 + 7) * 24 / (16 - 8)");
      done();
    });
  });
  it("should return There's no such command. Try !commands\n" +
  " to see the list of available commands", done => {
    help([null, "foobar"], data => {
      expect(data[1]).
        to.equal("There's no such command. Try !commands" +
                 " to see the list of available commands");
      done();
    });
  });
});