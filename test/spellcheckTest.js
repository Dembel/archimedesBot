const chai = require("chai");
const expect = chai.expect;
const spellcheck = require("../commands/spellcheck");

describe("Spellcheck module tests", () => {
  it("should return Empty query. Try !help spellcheck", done => {
    spellcheck([null, ""], data => {
      expect(data[1]).
        to.equal("Empty query. Try !help spellcheck");
      done();
    });
  });
});