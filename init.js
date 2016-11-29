/*
 * Init file to create credentials.json if it doesn't exist
 */

"use strict";

const fs = require("fs");
const https = require("https");
const querystring = require("querystring");
var APP_ID = "";
var APP_SECRET = "";
var PHONE_NUMBER = "";
var PASSWD = "";

//********** local helpers **********
const sendRequest = (opts, callback) => {
  const req = https.request(opts, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {
      callback(fullRes);
    });
  });

  req.end();
};

const sendPostRequest = (opts, data, callback) => {
  const req = https.request(opts, res => {
    var fullRes = "";

    res.on("data", data => {
      fullRes += data.toString();
    });

    res.on("end", () => {
      if (res.statusCode >= 300 || res.statusCode <= 400) {
        callback(res);
      } else {
        callback(fullRes);
      }
    });
  });

  req.write(data);
  req.end();
};

const question = (text, callback) => {
  const stdin = process.stdin;
  const stdout = process.stdout;
  
  stdout.write(text);
  stdin.once("data", data => {
    if (data !== null) {
      callback(data.toString().trim());
    } else {
      stdout.write("You should enter some value. Try again: \n");
      question(text, callback);
    }
  });
};

const loginReq = postData => {
  const REQ_OPTS = {
    hostname: "login.vk.com",
    path: "/?act=login&soft=1&utf8=1",
    method: "POST",
    headers: {
      "Referer": "https://oauth.vk.com/authorize?client_id=" + APP_ID +
        "&redirect_uri=https%3A%2F%2Foauth.vk.com%2Fblank.html" +
        "&response_type=code&scope=69632&v=5.60&state=&display=mobile&m=4&" +
        querystring.stringify({email: PHONE_NUMBER}),
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
      "Accept-Language": "en-US,en;q=0.5"
    }
  };
  console.log(REQ_OPTS.headers);
  sendPostRequest(REQ_OPTS, postData, res => {
    console.log(res.headers);
    console.log(res.statusCode);
  });
}

const createLoginPostReq = res => {
  const ip_hStart = "name=\"ip_h\" value=\"";
  const ip_hStop = "\" />\n<input type=\"hidden\" name=\"lg_h"
  const ip_h = res.slice(res.indexOf(ip_hStart) + ip_hStart.length,
                         res.indexOf(ip_hStop));
  const lg_hStart = "name=\"lg_h\" value=\"";
  const lg_hStop = "\" />\n<input type=\"hidden\" name=\"to";
  const lg_h = res.slice(res.indexOf(lg_hStart) + lg_hStart.length,
                         res.indexOf(lg_hStop));
  const toStart = "name=\"to\" value=\"";
  const toStop = "\">\n<dl class=\"fi_row\">\n<dt class=\"fi_label\">Phone";
  const to = res.slice(res.indexOf(toStart) + toStart.length,
                       res.indexOf(toStop));

  return querystring.stringify({
    _origin: "https://oauth.vk.com",
    ip_h: ip_h,
    lg_h: lg_h,
    to: to,
    email: PHONE_NUMBER,
    pass: PASSWD
  });
};

const getAccesToken = () => {
  const REQ_OPTS = {
    hostname: "oauth.vk.com",
    path: "/authorize?client_id=" + APP_ID +
      "&display=mobile&scope=messages,offline" +
      "&response_type=code&v=5.60&redirect_uri=https://oauth.vk.com/blank.html",
    headers: {
      "Accept-Language": "en-US,en;q=0.5"
    }
  };

  sendRequest(REQ_OPTS, response => {
//    console.log(createLoginPostReq(response));
//    console.log(response);
    loginReq(createLoginPostReq(response));
  });
};

const getPassword = () => {
  question("Enter your password: ", number => {
    PASSWD = number;
    getAccesToken()
  });
};

const getUserName = () => {
  question("Enter phone number to log into vk: ", number => {
    PHONE_NUMBER = number;
    getPassword();
  });
};

const getAppSecret = () => {
  question("Tnen copy an Application Secret and enter it here: ", secret => {
    APP_SECRET = secret;
    getUserName();
  });
};

const getAppId = () => {
  process.stdout.write("Create a new account in vk for the bot.\n");
  process.stdout.write("Then go here and create standalone application" +
                       " - https://vk.com/apps?act=manage\n");
  question("Tnen copy an Application id and enter it here: ", id => {
    APP_ID += id;
    getAppSecret();
  });
};
//********** local helpers end **********
const init = callback => {
  fs.stat("./credentials.json", (err, stat) => {
    if (err) {
      process.stdout.write("There's no credentials file.\n");
      process.stdout.write("Let's create one.\n");
      getAppId();
    } else {
      callback();
    }
  });
};

module.exports = init;

