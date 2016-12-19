const chai = require("chai");
const expect = chai.expect;
const calc = require("../commands/calc");
const config = require("../config.json");
const initialLang = config.lang;
const fs = require("fs");

describe("Calc module tests", () => {
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

  it("should return ok\\n12+6 = 18", (done) => {    
    calc([null, "12 + 6"], (data) => {
      expect(data[1]).to.equal("ok\n12+6 = 18");
      done();
    });
  });
  it("should return ok\\n12+6+124+(11+7) = 160", (done) => {    
    calc([null, "12 + 6 + 124 + (11 + 7)"], (data) => {
      expect(data[1]).to.equal("ok\n12+6+124+(11+7) = 160");
      done();
    });
  })
  it("should return ok\\n-12^6 = 2985984", (done) => {    
    calc([null, "-12 ^ 6"], (data) => {
      expect(data[1]).to.equal("ok\n-12^6 = 2985984");
      done();
    });
  });
  it("should return ok\\n((-12.3465*2)/10+(8-4))^6 = 12.863", (done) => {    
    calc([null, "((-12.3465 * 2) / 10 + (8 - 4)) ^ 6"], (data) => {
      expect(data[1]).to.equal("ok\n((-12.3465*2)/10+(8-4))^6 = 12.863");
      done();
    });
  });
  it("should return ok\\n((-12.3465*10)/10+(8-4))^6 = 338085.377", (done) => {
    calc([null, "((-12.3465 * 10) / 10 + (8 - 4)) ^ 6"], (data) => {
      expect(data[1]).to.equal("ok\n((-12.3465*10)/10+(8-4))^6 = 338085.377");
      done();
    });
  });
  it("should return ok\\n-12^9 = -5159780352", (done) => {    
    calc([null, "-12 ^ 9"], (data) => {
      expect(data[1]).to.equal("ok\n-12^9 = -5159780352");
      done();
    });
  });
  it("should return ok\\n((12+6)-(12+6))/2 = 0", (done) => {    
    calc([null, "((12 + 6) - (12 + 6)) / 2"], (data) => {
      expect(data[1]).to.equal("ok\n((12+6)-(12+6))/2 = 0");
      done();
    });
  })
  it("should return ok\\n((12+6)-(12+6))*0 = 0", (done) => {    
    calc([null, "((12 + 6) - (12 + 6)) * 0"], (data) => {
      expect(data[1]).to.equal("ok\n((12+6)-(12+6))*0 = 0");
      done();
    });
  });
  it("should return ok\\n12+6+-124+(11+7) = -88", (done) => {    
    calc([null, "12 + 6 + -124 + (11 + 7)"], (data) => {
      expect(data[1]).to.equal("ok\n12+6+-124+(11+7) = -88");
      done();
    });
  });
  it("should return ok\\n1.2+6+-12.4+(11+7) = 12.8", (done) => {    
    calc([null, "1,2 + 6 + -12.4 + (11 + 7)"], (data) => {
      expect(data[1]).to.equal("ok\n1.2+6+-12.4+(11+7) = 12.8");
      done();
    });
  });
  it("should return ok\\n1.2+6+124+(-11+7) = 127.2", (done) => {    
    calc([null, "1.2 + 6 + 124 + (-11 + 7)"], (data) => {
      expect(data[1]).to.equal("ok\n1.2+6+124+(-11+7) = 127.2");
      done();
    });
  });
  it("should return ok\\n(12+6)*124-(11+7) = 2214", (done) => {    
    calc([null, "(12 + 6) * 124 - (11 + 7)"], (data) => {
      expect(data[1]).to.equal("ok\n(12+6)*124-(11+7) = 2214");
      done();
    });
  });
  it("should return ok\\n(12-6.3)/124+(11+7) = 18.046", (done) => {    
    calc([null, "(12 - 6.3) / 124 + (11 + 7)"], (data) => {
      expect(data[1]).to.equal("ok\n(12-6.3)/124+(11+7) = 18.046");
      done();
    });
  });
  it("should return ok\\n(8.7653+63.12)^2*12.5/(1.1+34.2134)" +
     " = 1829.156", (done) => {    
    calc([null, "( 8.7653 + 63.12) ^ 2 *    12.5/(1.1 +34.2134  )"], (data) => {
      expect(data[1]).to.equal("ok\n(8.7653+63.12)" +
                               "^2*12.5/(1.1+34.2134) = 1829.156");
      done();
    });
  });
  it("should return ok\\n((123424234231.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = 2.528745451e+15", (done) => {    
    calc([null,
          "((123424234231,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((123424234231.56673221-21344)" +
                               "/-2454.456+(-123.1*7))^2 = 2.528745451e+15");
      done();
    });
  });
  it("should return ok\\n((2534242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "1,067832343e+12", (done) => {    
    calc([null,
          "((2534242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((2534242342.56673221-21344)" +
                                        "/-2454.456+(-123.1*7))^2 =" +
                                        " 1.067832343e+12");
      done();
    });
  });
  it("should return ok\\n((22534242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "8.430554029e+13", (done) => {    
    calc([null,
          "((22534242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((22534242342.56673221-21344)" +
                                        "/-2454.456+(-123.1*7))^2 =" +
                                        " 8.430554029e+13");
      done();
    });
  });
  it("should return ok\\n((1234242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "253724573310.822", (done) => {    
    calc([null,
          "((1234242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((1234242342.56673221-21344)" +
                               "/-2454.456+(-123.1*7))^2 =" +
                               " 253724573310.822");
      done();
    });
  });
  it("should return ok\\n((2434242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "985289521302.064", (done) => {    
    calc([null,
          "((2434242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((2434242342.56673221-21344)" +
                                        "/-2454.456+(-123.1*7))^2 =" +
                                        " 985289521302.064");
      done();
    });
  });
  it("should return ok\\n((2334242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "906066557249.092", (done) => {    
    calc([null,
          "((2334242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((2334242342.56673221-21344)" +
                                        "/-2454.456+(-123.1*7))^2 =" +
                                        " 906066557249.092");
      done();
    });
  });
  it("should return ok\\n((2234242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "830163451084.672", (done) => {    
    calc([null,
          "((2234242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((2234242342.56673221-21344)" +
                                        "/-2454.456+(-123.1*7))^2 =" +
                                        " 830163451084.672");
      done();
    });
  });
  it("should return ok\\n((1534242342.56673221-21344)" +
     "/-2454.456+(-123.1*7))^2\n = " +
     "391797728813.182", (done) => {    
    calc([null,
          "((1534242342,56673221-21344)/-2454.456+(-123.1*7))^2"], (data) => {
      expect(data[1]).to.equal("ok\n((1534242342.56673221-21344)" +
                                        "/-2454.456+(-123.1*7))^2 =" +
                                        " 391797728813.182");
      done();
    });
  }); 
  it("should return ok\\n-50371.803250061^2 = 2537318562.663", (done) => {    
    calc([null,
          "-50371,803250061^2"], (data) => {
      expect(data[1]).to.equal("ok\n-50371.803250061^2 = 2537318562.663");
      done();
    });
  });
  it("should return ok\\n(1.2+6)-124 = -116.8", (done) => {    
    calc([null, "(1.2 + 6) - 124"], (data) => {
      expect(data[1]).to.equal("ok\n(1.2+6)-124 = -116.8");
      done();
    });
  });
  it("should return ok\\n(-1.2+-6)-1 = -8.2", (done) => {    
    calc([null, "(-1.2 + -6) - 1"], (data) => {
      expect(data[1]).to.equal("ok\n(-1.2+-6)-1 = -8.2");
      done();
    });
  });
  it("should return ok\\n12*6 = 72", (done) => {    
    calc([null, "12 * 6"], (data) => {
      expect(data[1]).to.equal("ok\n12*6 = 72");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (11 + 7"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (11 +* 7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + @ - (11 + 7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124  (11 + 7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (11 + .7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (11 + 7.)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124. + (11 + 7.789)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + .6 + 124 + (11 + 7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (11 + 7)."], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (a + 7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (178, + 7)"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 + 6 + 124 + (178 + 7) / 0"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12g6"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 g6"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 g 6"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "12 '6"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
  it("should return Bad expression", (done) => {    
    calc([null, "a1g6"], (data) => {
      expect(data[1]).to.equal("Bad expression");
      done();
    });
  });
});