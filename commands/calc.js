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

// parse an expression
const parse = exp => {
  let splited = [];
  let buffer = "";

  exp.split("").filter(val => val !== " ").forEach(val => {
    if (isNaN(parseFloat(val))) {
      if ((val === "-" && !buffer) || (val === "." && buffer)) {
        buffer += val;
      } else {
        if (buffer) splited.push(buffer);
        splited.push(val);
        buffer = ""; 
      }
    } else {
      buffer += val;
    }
  });
  if (buffer) splited.push(buffer);
  return splited;
};

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

const calc = (data, cb) => {
  const cmd = data[0];
  const exp = data[1];
  const expression = parse(exp);
  const result = calculate(expression);
  const msg = isNaN(result) || !checkSyntax(expression) ?
    "Bad expression" :
    "ok\n" + expression.join("") + " = " + result;

  cb([cmd, msg]);
};

module.exports = calc;