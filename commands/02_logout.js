'use strict';

var chalk = require('chalk');
var prompt = require('../lib/prompt.js');
var credentials = require('../lib/credentials.js');
var multiline = require('multiline');


var usage = multiline(function() {/*
  Command does not take parameters, upon executing it login credentials (if
  present) will be wiped out from your filesystem.

  Logout from this CLI tool:
  $ qtime logout
*/});

function reportSuccess() {
  console.log(chalk.bold.green('Success,'),
    'you are logged out.');
}

function askToConfirm() {
  //jshint validthis:true
  if (!this.credentials) {
    console.log(chalk.bold.yellow('Warning:'),
      'credentials are not found!',
      'Nothing to delete...');
    return;
  }

  var question = {
    type: 'confirm',
    message: 'Are you sure you want logout?',
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

      return credentials.clean()
        .then(reportSuccess);
    });
}

module.exports = {
  name: 'logout',
  action: askToConfirm,
  requiresLogin: true,
  description: 'Invokes logout procedure',
  usage: usage
};
