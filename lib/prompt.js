'use strict';

var Promise  = require('bluebird');
var inquirer = require('inquirer');

module.exports = function prompt(args) {
  var questions;

  if (Array.isArray(args))
    questions = args;
  else
    questions = [].slice.call(arguments, 0);

  return new Promise(function(resolve, reject) {
    inquirer.prompt(questions, resolve);
  });
};
