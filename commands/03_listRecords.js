'use strict';

var Client = require('qtimecards');
var calculateOffset = require('../lib/utils.js').calculateOffset;
var clipRecordsData = require('../lib/utils.js').clipRecordsData;
var printJson = require('../lib/jsonPrinter.js').print;
var printRecord = require('../lib/recordPrinter.js').print;
var multiline = require('multiline');


var usage = multiline(function() {/*
  Command takes one of: "day", "week", "month" as an input or it can be called
  with specific month in following format: MM/YYYY In case of no input specified
  "day" is assumed.

  Print today's records:
  $ qtime list-records

  Print this week's records:
  $ qtime list-records week

  Print records from 12/2015:
  $ qtime list-records 12/2015

  To normalize daily records use "--normalize" flag.
*/});

var RecordRange = {
  DAY: 'day',
  WEEK: 'isoWeek',
  MONTH: 'month',
  ALL: 'all'
};

function calculateParams(arg) {
  var offset;
  var range;

  if (!arg || arg === 'today') {
    offset = 1;
    range = RecordRange.DAY;
  } else if (arg === 'week') {
    offset = 1;
    range = RecordRange.WEEK;
  } else if (arg === 'month') {
    offset = 1;
    range = RecordRange.MONTH;
  } else {
    offset = calculateOffset(arg);
    range = RecordRange.ALL;
  }

  return {
    offset: offset,
    range: range
  };
}

function listRecords(arg) {
  //jshint validthis:true
  var config = this.config;
  var credentials = this.credentials;

  var params = calculateParams(arg);
  var offset = params.offset;
  var range = params.range;

  var options = {
    userId: this.user || credentials.userId,
    sortOrder: this.sort || 'asc',
    normalizeRecords: this.norm || false,
    includeAbsenceInfo: true,
    offset: offset
  };

  var printFormat = this.format;

  function printData(data) {
    var clipped = clipRecordsData(data, range);

    if (printFormat === 'json') {
      printJson(clipped);
      return;
    }

    if (printFormat === 'pretty') {
      printJson(clipped, { pretty: true });
      return;
    }

    clipped.records.forEach(function(dailyRecord) {
      printRecord(dailyRecord, options.sortOrder);
    });
  }

  var client = new Client(config.baseUrl);
  return client
    .login(credentials.username, credentials.password)
    .then(client.getRecords.bind(client, options))
    .then(printData);
}

module.exports = {
  name: 'list-records',
  args: '[arg]',
  options: [
    //NOTE: do NOT use "normalize" variant it is used internally inside commander.js
    [ '-n, --norm', 'normalize daily records' ],
    [ '-s, --sort [method]', 'sorting method: "asc" or "desc" (default="asc")' ],
    [ '-f, --format [format]', 'output format: "table", "json", "pretty" (default="table")' ],
    [ '-u, --user [userId]', 'override userId' ]
  ],
  description: 'Prints daily records',
  usage: usage,
  action: listRecords,
  requiresLogin: true
};
