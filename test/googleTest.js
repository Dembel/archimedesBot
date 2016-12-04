const chai = require("chai");
const expect = chai.expect;
const google = require("../commands/google");

describe("Google module tests", () => {
  const lang_ru = "lang_ru";
  const lang_en = "lang_en";
  const uri = "www.google.com/search?lr=";
  const should = "should return ";

  it(should.concat(uri, lang_ru, "&q=", "Кролик+Роджер"), done => {
    google([null, "Кролик Роджер"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_ru, "&q=", "Кролик+Роджер"));
      done();
    });
  });
  it(should.concat(uri, lang_ru, "&q=", "кролик"), done => {
    google([null, "кролик"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_ru, "&q=", "кролик"));
      done();
    });
  });
  it(should.concat(uri, lang_ru, "&q=", "кролик12+4567+Роджер+123_5"), done => {
    google([null, "кролик12 4567 Роджер 123_5"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_ru, "&q=", "кролик12+4567+Роджер+123_5"));
      done();
    });
  });
  it(should.concat(uri, lang_en, "&q=", "Roger+Rabbit"), done => {
    google([null, "Roger Rabbit"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_en, "&q=", "Roger+Rabbit"));
      done();
    });
  });
  it(should.concat(uri, lang_en, "&q=", "Roger"), done => {
    google([null, "Roger"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_en, "&q=", "Roger"));
      done();
    });
  });
  it(should.concat(uri, lang_en, "&q=", "Roger12+548"), done => {
    google([null, "Roger12 548"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_en, "&q=", "Roger12+548"));
      done();
    });
  });
  it(should.concat(uri, lang_en, "&q=", "Roger+Rabbit1235+345466_9"), done => {
    google([null, "Roger Rabbit1235 345466_9"], data => {
      expect(data[1]).
        to.equal(uri.concat(lang_en, "&q=", "Roger+Rabbit1235+345466_9"));
      done();
    });
  });
  it(should.concat("Empty search query. Try !help google"), done => {
    google([null, ""], data => {
      expect(data[1]).
        to.equal("Empty search query. Try !help google");
      done();
    });
  });
});