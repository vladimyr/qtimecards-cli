'use strict';

var util = require('util');
var chalk = require('chalk');
var Table = require('cli-table');
var utils = require('./utils.js');


var blank = '';

var tableLayout = {
  head: [
    chalk.bold.cyan('Time'),
    chalk.bold.cyan('Type'),
    chalk.bold.cyan('Location'),
    blank
  ],
  colAligns: [
    'right',
    'left',
    'left',
    'left'
  ]
};

function printHeader(dailyRecord) {
  var date = utils.getLocalDate(dailyRecord.date);
  var weekday = utils.getWeekday(dailyRecord.weekday);

  var desc;
  if (dailyRecord.comment)
    desc = chalk.magenta(util.format('(%s)', dailyRecord.comment));
  else
    desc = '';

  console.log();
  console.log(' Entries for: %s %s %s',
    chalk.bold.grey(date), chalk.bold.grey(weekday), desc);

  var absence = dailyRecord.absence;
  if (!absence) {
    console.log();
    return;
  }

  var indicator;
  if (absence.counted)
    indicator = chalk.green('\u2714');
  else
    indicator = chalk.red('\u2716');

  console.log(' Absence:', chalk.bold.blue(absence.type));
  console.log(' Counted:', indicator);
  console.log();
}

function pushStats(table, dailyRecord) {
  table.push([
    chalk.bold.cyan('Working'),
    chalk.bold.cyan('Break'),
    chalk.bold.cyan('Total'),
    chalk.bold.cyan('Overtime')
  ]);

  table.push([
    chalk.bold(dailyRecord.working),
    dailyRecord.break,
    chalk.bold(dailyRecord.total),
    chalk.bold.magenta(dailyRecord.overtime)
  ]);
}

function printRecord(dailyRecord, sortOrder) {
  var entriesTable = new Table(tableLayout);

  dailyRecord.entries.forEach(function printEntry(entry, i) {
    var indicator = '\u2B24';
    if (entry.type === 'in')
      indicator = chalk.green(indicator);
    else
      indicator = chalk.red(indicator);

    var time = entry.time;

    var arrow;
    if (sortOrder === 'desc')
      arrow = '\u25BC';
    else
      arrow = '\u25B2';

    if (entry.normalized)
      time = chalk.bold.yellow(util.format('%s %s', arrow, time));
    else
      time = chalk.bold.grey(time);

    entriesTable.push([
      time,
      indicator,
      entry.location,
      blank
    ]);
  });

  if (!dailyRecord.entries || dailyRecord.entries.length === 0)
    entriesTable.push([ blank, blank, blank, blank ]);

  pushStats(entriesTable, dailyRecord);
  printHeader(dailyRecord);

  console.log(entriesTable.toString());
  console.log();
}

module.exports = {
  print: printRecord
};
