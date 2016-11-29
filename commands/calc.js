/*
 * Calculator
 */

"use strict";

const vkapi = require("../apis/vkapi");
//********** local helpers **********
// check whether opening parens amount is equal to closing parens amount
const checkParens = exp => exp.filter(val => val === "(").length ===
  exp.filter(val => val === ")").length;
// parse an expression
const parse = exp => {
  let splited = [];
  let buffer = "";

  exp.split("").forEach(val => {
    if (isNaN(parseFloat(val))) {
      splited.push(buffer);
      splited.push(val);
      buffer = "";
    } else {
      buffer += val;
    }
  });
  splited.push(buffer);
  return splited.filter(val => val !== "" && val !== " ");
};
// operations and related stuff
const add = (a, b) => b + a;
const subtract = (a, b) => b - a;
const multiply = (a, b) => b * a;
const divide = (a, b) => b / a;
const exp = (a, b) => Math.pow(b, a);

const opsEval = {"+": add, "-": subtract, "*": multiply, "/": divide, "^": exp};
const precedence = {"^": 3, "*": 2, "/": 2, "+": 1, "-": 1};
const ops = "^*/+-";
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

  opStack.reverse().forEach(val => pfixStr.push(val));
  return pfixStr;
};
// evaluate postfix
const calculate = exp => {
  let stack = [];

  infixToPostfix(exp).forEach(val => {
    if (ops.includes(val)) {
      stack.push(opsEval[val](parseFloat(stack.pop()), parseFloat(stack.pop())));
    } else {
      stack.push(val);
    }
  });

  return stack.pop();
};
//********************
const calc = (cmd, exp) => {
  const expression = parse(exp);
  const result = calculate(expression);
  const msg = isNaN(result) || !checkParens(expression) ? "Bad expression" :
    "ok\n" + expression.join("") + " = " + result;

  vkapi.sendMessage(cmd, msg);
};

module.exports = calc;