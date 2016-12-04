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

// check whether opening parens number is equal to closing one
const checkParens = exp =>
  exp.filter(val => val === "(").length ===
  exp.filter(val => val === ")").length;
// check whether there is right number of operators
const checkOps = exp =>
  exp.filter(val => !isNaN(val)).length -
  exp.filter(val => ops.includes(val)).length === 1;
// check syntax wrapper
const checkSyntax = exp => checkParens(exp) && checkOps(exp);

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
//********************

const calc = (data, cb) => {
  const [cmd, exp] = data;
  const expression = parse(exp);
  const result = calculate(expression);
  const msg = isNaN(result) || !checkSyntax(expression) ?
    "Bad expression" : "ok\n".concat(expression.join(""), " = ", result);

  cb([cmd, msg]);
};

module.exports = calc;