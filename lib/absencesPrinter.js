'use strict';

var chalk = require('chalk');
var Table = require('cli-table');
var utils = require('./utils.js');


var tableLayout = {
  head: [
    chalk.cyan('Date'),
    chalk.cyan('Type'),
    chalk.cyan('Counted')
  ],
  colAligns: [
    'left',
    'middle',
    'middle'
  ]
};

function printAbsences(data) {
  var absencesTable = new Table(tableLayout);

  data.absences.forEach(function printAbsence(absence, i) {

    var date = utils.getLocalDate(absence.date);
    var indicator;
    if (absence.counted)
      indicator = chalk.green('\u2714');
    else
      indicator = chalk.red('\u2716');

    absencesTable.push([
      date,
      chalk.blue(absence.type),
      indicator
    ]);
  });

  console.log();
  console.log(' Absence list for: %s', chalk.bold(data.month));
  console.log(absencesTable.toString());
  console.log();
}

module.exports = {
  print: printAbsences
};
