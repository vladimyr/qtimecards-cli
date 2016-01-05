'use strict';

var Client = require('qtimecards');
var printJson = require('../lib/jsonPrinter.js').print;
var printVacationInfo = require('../lib/vacationInfoPrinter.js').print;
var multiline = require('multiline');

var usage = multiline(function() {/*
  Command does not take parameters, it prints out vacation information for the
  current year. Output format can be altered by using listed options.

  Logout from this CLI tool:
  $ qtime vacation-info
*/});


function getVacationInfo() {
  //jshint validthis:true
  var config = this.config;
  var credentials = this.credentials;

  var options = {
    userId: credentials.userId
  };

  var printFormat = this.format;

  function printData(data) {
    if (printFormat === 'json') {
      printJson(data);
      return;
    }

    if (printFormat === 'pretty') {
      printJson(data, { pretty: true });
      return;
    }

    printVacationInfo(data);
  }

  var client = new Client(config.baseUrl);
  return client
    .login(credentials.username, credentials.password)
    .then(client.getVacationInfo.bind(client, options))
    .then(printData);
}

module.exports = {
  name: 'vacation-info',
  options: [
    [ '-f, --format [format]', 'output format: "table", "json", "pretty" (default="table")' ]
  ],
  action: getVacationInfo,
  description: 'Prints vacation category & usage information',
  requiresLogin: true,
  usage: usage
};
