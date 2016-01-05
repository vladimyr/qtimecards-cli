'use strict';

var util = require('util');
var Url = require('url');
var _ = require('lodash');
var chalk = require('chalk');
var prompt = require('../lib/prompt.js');
var credentials = require('../lib/credentials.js');
var multiline = require('multiline');
var Client = require('qtimecards');

var usage = multiline(function() {/*
  Command does not take parameters instead it starts interactive session during
  which you are asked to enter your qtimecards username (or email), your
  password and in case of admin users your userId. Upon entering your data it
  will be encrypted and stored at following location:
  $HOME/.qtimecards/credentials.enc

  Start interactive login session:
  $ qtime login
*/});


_.mixin({ not: function(value) { return !value; }});
var emptyFilter = _.compose(_.not, _.isEmpty);
var notNumber = _.compose(_.not, _.isEmpty);


function setEmailDomain(emailDomain) {
  return function transformInput(input) {
    if (input.indexOf('@') == -1)
      return util.format('%s@%s', input, emailDomain);

    return input;
  };
}

function attachUserId(client, data) {
  var userId = client.getUserId();

  if (userId) {
    data.userId = userId;
    return data;
  }

  var question = {
    type: 'input',
    message: 'Enter your userId:',
    name: 'userId',
    validate: notNumber
  };

  return prompt(question)
    .then(function complete(answers) {
      data.userId = answers.userId;
      return data;
    });
}

function storeCredentials(data) {
  //jshint validthis:true
  var client = this;
  return attachUserId(client, data)
    .then(credentials.store);
}

function reportSucces() {
  console.log(chalk.bold.green('Success,'),
    'your credentials are remembered.',
    'To remove them execute', chalk.bold('logout'), 'command.');
}

function doLogin(data) {
  //jshint validthis:true
  var client = new Client(this.config.baseUrl);
  return client
    .login(data.username, data.password)
    .thenReturn(data)
    .then(storeCredentials.bind(client))
    .then(reportSucces);
}

function askForCredentials() {
  //jshint validthis:true
  var config = this.config;
  var hostname = Url.parse(config.baseUrl).hostname;

  var questions = [{
    type: 'input',
    message: 'Enter your username (email):',
    name: 'username',
    validate: emptyFilter,
    filter: setEmailDomain(config.emailDomain)
  }, {
    type: 'password',
    message: 'Enter your password:',
    name: 'password',
    validate: emptyFilter
  }];

  console.log('Enter your', chalk.bold(hostname), 'credentials');
  return prompt(questions)
    .then(doLogin.bind(this));
}

module.exports = {
  name: 'login',
  action: askForCredentials,
  description: 'Invokes login procedure',
  usage: usage
};
