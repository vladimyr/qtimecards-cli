'use strict';

var Client = require('qtimecards');
var calculateOffset = require('../lib/utils.js').calculateOffset;
var printJson = require('../lib/jsonPrinter.js').print;
var printAbsences = require('../lib/absencesPrinter.js').print;
var multiline = require('multiline');


var usage = multiline(function(){/*
  Command takes month as optional parameter that should be provided in following
  format: MM/YYYY In case no parameter is send current month is assumed.

  Print absences for 12/2015:
  $ qtime list-absences 12/2015

  Print current month's absences:
  $ qtime list-absences
*/});

function listAbsences(month) {
  //jshint validthis:true
  var config = this.config;
  var credentials = this.credentials;

  var options = {
    userId: credentials.userId,
    sortOrder: this.sort || 'asc',
    offset: calculateOffset(month)
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

    printAbsences(data);
  }

  var client = new Client(config.baseUrl);
  return client
    .login(credentials.username, credentials.password)
    .then(client.getAbsences.bind(client, options))
    .then(printData);
}

module.exports = {
  name: 'list-absences',
  args: '[month]',
  options: [
    [ '-s, --sort [method]', 'sorting method: "asc" or "desc" (default="asc")' ],
    [ '-f, --format [format]', 'output format: "table", "json", "pretty" (default="table")' ]
  ],
  action: listAbsences,
  description: 'Prints monthly absence records',
  usage: usage,
  requiresLogin: true
};
