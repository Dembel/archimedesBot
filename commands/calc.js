/*
 * Calculator
 * 
 * Designed by Dmitry Lukashevich a.k.a. Dembel
 */

"use strict";
//********** local helpers **********
// operations and related stuff
const add = (a, b) => b + a;
const subtract = (a, b) => b - a;
const multiply = (a, b) => b * a;
const divide = (a, b) => a !== 0 ? b / a : "Dividing by zero is undefined";
const exp = (a, b) => Math.pow(b, a);

const opsEval = {"+": add, "-": subtract, "*": multiply, "/": divide, "^": exp};
const precedence = {"^": 3, "*": 2, "/": 2, "+": 1, "-": 1};
const ops = "^*/+-";
const appropriateSymbs = ops.concat("(),.", "1234567890", " ");

// check whether opening parens number is equal to closing one
const checkParens = exp =>
  exp.filter(val => val === "(").length ===
  exp.filter(val => val === ")").length;
// check whether there is right number of operators
const checkOps = exp =>
  exp.filter(val => !isNaN(val)).length -
  exp.filter(val => ops.includes(val)).length === 1;
// check for appropriate symbols
const checkSymb = exp =>
  exp.every(val => appropriateSymbs.includes(val));
// check syntax
const checkSyntax = exp => checkParens(exp) && checkOps(exp);

// convert to postfix
const infixToPostfix = exp => {
  let opStack = [];
  let pfixStr = [];

  exp.forEach(val => {
    if (ops.includes(val)) {
      if (precedence[val] > precedence[opStack[opStack.length - 1]] ||
          !opStack.length) {
        opStack.push(val);
      } else {
        while (precedence[val] <= precedence[opStack[opStack.length - 1]]) {
          const op = opStack.pop();
          if (op === "(") {
            break;
          } 
          pfixStr.push(op);
        }
        opStack.push(val);
      }
    } else if (val === "(") {
      opStack.push(val);
    } else if (val === ")") {
      while (opStack[opStack.length - 1] !== "(" && opStack.length) {
        pfixStr.push(opStack.pop());
      }
      opStack.pop();
    } else {
      pfixStr.push(val);
    }
  });

  return pfixStr.concat(opStack.reverse());
};
// evaluate postfix
const calculate = exp => {
  let stack = [];

  infixToPostfix(exp).forEach(val => {
    if (ops.includes(val)) {
      stack.push(opsEval[val](Number(stack.pop()), Number(stack.pop())));
    } else {
      stack.push(val);
    }
  });

  if (stack[0].toString().split(".")[0].length > 12) {
    return stack.pop().toExponential(9).
      replace(/0+$/, "").replace(/\.$/, "");
  } else {
    return stack.pop().toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
  }
};
// parse an expression
const parse = exp => {
  let splited = [];
  let buffer = "";

  Array.from(exp).filter(val => val !== " ").forEach(val => {
    switch (isNaN(val)) {
      case true:
      if ((val === "-" && !buffer) || (".,".includes(val) && buffer)) {
        if (splited[splited.length - 1] === ")") {
          if (buffer) splited.push(buffer);
          splited.push(val);
          buffer = ""; 
        } else {
          buffer += val.replace(/,/g, ".");
        }
      } else if (",.".includes(buffer[buffer.length - 1])) {
        buffer = "bad";
      } else {
        if (buffer) splited.push(buffer);
        splited.push(val);
        buffer = ""; 
      }
      break;
      case false:
      buffer += val;
      break;
    }
  });
  if (buffer) splited.push(buffer);
  return splited;
};

const getResult = exp => {
  const expression = parse(exp);
  const config = require("../config.json");
  const badExpression = config.lang === "en" ?
    require("../vocabulary/calcVocab.json").en.badExpression:
    require("../vocabulary/calcVocab.json").ru.badExpression;

  if (checkSyntax(expression) && checkSymb(exp.split(""))) {
    const result = calculate(expression);

    return isNaN(result) ? badExpression:
      "ok\n".concat(expression.join(""), " = ", result);
  } else {
    return badExpression;
  }
};
//********************

const calc = (data, cb) => {
  const [cmd, exp] = data;

  cb([cmd, getResult(exp)]);
};

module.exports = calc;