'use strict';

var Client = require('qtimecards');
var chalk = require('chalk');
var calculateOffset = require('../lib/utils.js').calculateOffset;
var printJson = require('../lib/jsonPrinter.js').print;
var printStats = require('../lib/statsPrinter.js').print;
var multiline = require('multiline');


var usage = multiline(function() {/*
  Command takes month as optional parameter that should be provided in following
  format: MM/YYYY If parameter is omitted current month is assumed.

  Print stats for current month:
  $ qtime stats

  Print stats for 12/2015:
  $ qtime stats 12/2015
*/});

function getData(month) {
  //jshint validthis:true
  var config = this.config;
  var credentials = this.credentials;

  var dailyNorm = this.daily || 8;

  var options = {
    userId: credentials.userId,
    offset: calculateOffset(month),
    dailyNorm: dailyNorm * 60 // in minutes
  };

  var printFormat = this.format;

  function printData(data) {
    if (printFormat === 'json') {
      printJson({
        month: data.month,
        stats: data.stats
      });
      return;
    }

    if (printFormat === 'pretty') {
      printJson({
        month: data.month,
        stats: data.stats
      }, {
        pretty: true
      });
      return;
    }

    printStats(data, dailyNorm);
  }

  var client = new Client(config.baseUrl);
  return client
    .login(credentials.username, credentials.password)
    .then(client.getRecords.bind(client, options))
    .then(printData);
}

module.exports = {
  name: 'stats',
  args: '[month]',
  options: [
    [ '-s, --sort [method]', 'sorting method: "asc" or "desc" (default="asc")' ],
    [ '-f, --format [format]', 'output format: "table", "json", "pretty" (default="table")' ]
  ],
  action: getData,
  description: 'Prints monthly stats',
  requiresLogin: true,
  usage: usage
};
