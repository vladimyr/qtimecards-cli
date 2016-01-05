'use strict';

var util = require('util');
var chalk = require('chalk');
var credentials = require('./credentials.js');
var settings = require('./settings.js');


function decorateAction(action, decoratorFn, propName, errorCb) {
  return function decoratedAction() {
    var ctx = this;
    var args = [].slice.call(arguments, 0);

    var decoratorError;

    function onDecoratorError(err) {
      decoratorError = err;
      errorCb(err);
    }

    function actionWrapper(data) {
      if (decoratorError)
        return;

      ctx[propName] = data;
      return action.apply(ctx, args);
    }

    var decoratorPromise = decoratorFn();
    if (errorCb)
      decoratorPromise = decoratorPromise.catch(onDecoratorError);

    return decoratorPromise
     .then(actionWrapper);
  };
}

function ensureSettings(program, action) {
  return decorateAction(action,
    settings.load, 'config');
}

function ensureLogin(program, action) {
  function reportLoginFailure(err) {
    console.error(chalk.bold.red('Error:'),
      'Command requires authentication, please run',
      chalk.bold(program.name()), chalk.bold('login'),
      'before');
  }

  return decorateAction(action,
    credentials.retrieve, 'credentials',
    reportLoginFailure);
}

function registerCommand(program, data, errorCb) {
  var name = data.name;

  if (data.args)
    name = util.format('%s %s', name, data.args);

  var action = data.action;
  action = ensureSettings(program, action);

  if (data.requiresLogin)
    action = ensureLogin(program, action);

  var command = program.command(name);
  if (data.options && data.options.length > 0) {
    data.options.forEach(function addOption(optionParams) {
      command.option.apply(command, optionParams);
    });
  }

  if (data.description)
    command.description(chalk.gray(data.description));

  if (data.usage)
    command.usage(util.format('\n\n%s', data.usage));

  command.action(function actionRunner(cmd) {
    var args = [].slice.call(arguments, 0);
    return action.apply(this, args)
      .catch(errorCb);
  });

  return data.name;
}

module.exports = registerCommand;
