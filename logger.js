/*
 * Logger.
 * Logs bots errors into the archimede_debug.log file
 */

"use strict";
const winston = require("winston");

winston.configure({
  transports: [
    new (winston.transports.File)({filename: "archimede_debug.log"})
  ]
});

module.exports = winston;