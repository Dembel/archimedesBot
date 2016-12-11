const chai = require("chai");
const expect = chai.expect;
const urbandef = require("../commands/urbandef");

describe("Urbandef module tests", function () {
  it("should return Empty query. Try !help urbandef", done => {
    urbandef([null, ""], data => {
      expect(data[1]).to.contain("Empty query. Try !help urbandef");
      done();
    });
  });
});