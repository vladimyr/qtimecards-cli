'use strict';

var util = require('util');
var chalk = require('chalk');
var moment = require('moment');
var prompt = require('../lib/prompt.js');
var multiline = require('multiline');
var Client = require('qtimecards');


var usage = multiline(function() {/*
  Command does not take any parameters, instead it triggers interactive mode
  enabling you to perform following tasks:

   * set record reason
   * add description
   * edit record time

  Upon final confirmation record is send to the server.

  Enter interactive mode:
  $ qtime add-record

  To prevent adding record abort request by using confirmation prompt or kill
  command with Ctrl-C combo.
*/});

var recordTimeFormat = 'DD/MM/YYYY HH:mm';

function setTimeFormat(str) {
  return moment(str, recordTimeFormat).format(recordTimeFormat);
}

function validateTime(str) {
  if (moment(str, recordTimeFormat).isValid())
    return true;

  return util.format('Please enter valid time in following format: %s',
    recordTimeFormat);
}

function askToConfirm(recordData) {
  //jshint validthis:true
  var config = this.config;
  var credentials = this.credentials;

  var question = {
    type: 'confirm',
    message: 'Are you sure you want to submit new record?',
    name: 'confirmed',
    'default': false
  };

  return prompt(question)
    .then(function complete(data) {
      var isApproved = data.confirmed;

      if (!isApproved) {
        console.log('Operation', chalk.bold('aborted!'),
          'Request is discarded.');
        return;
      }

      return submitRecord(config, credentials, recordData);
    });
}

function reportSuccess() {
  console.log(chalk.green('Success,'),
    'your record is submitted.');
}

function submitRecord(config, credentials, data) {
  var client = new Client(config.baseUrl);
  return client
    .login(credentials.username, credentials.password)
    .then(client.submitRecord(data).bind(client))
    .then(reportSuccess);
}

function askQuestions() {
  //jshint validthis:true
  var config = this.config;

  var questions = [{
    type: 'list',
    message: 'Select reason:',
    name: 'reason',
    choices: config.recordReasons,
    'default': config.defaultReason
  }, {
    type: 'input',
    name: 'time',
    message: util.format('Modify record time [%s]:', recordTimeFormat),
    'default': moment().format(recordTimeFormat),
    filter: setTimeFormat,
    validate: validateTime
  }, {
    type: 'input',
    message: '[optional] Enter your message:',
    name: 'message'
  }];

  console.log('Enter record data');
  return prompt(questions)
    .then(askToConfirm.bind(this));
}

module.exports = {
  name: 'add-record',
  action: askQuestions,
  usage: usage,
  description: 'Creates new record',
  requiresLogin: true
};
