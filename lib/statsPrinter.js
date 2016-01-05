'use strict';

var chalk = require('chalk');
var Table = require('cli-table');

var blank = '';
var tableLayout = {
  head: [
    blank,
    chalk.cyan('Duration')
  ],
  colAligns: [
    'right',
    'right'
  ]
};

function printHeader(month, dailyNorm) {
  console.log();
  console.log(' Monthly stats for: %s', chalk.bold(month));
  console.log(' [assumes %s working hrs per day]', chalk.yellow(dailyNorm));
  console.log();
}

function printStats(data, dailyNorm) {
  var stats = data.stats;
  var statsTable = new Table(tableLayout);

  statsTable.push([ chalk.blue('Expected:'),
    stats.expected ]);

  statsTable.push([ chalk.blue('Completed:'),
    chalk.bold(stats.completed) ]);

  statsTable.push([ chalk.yellow('Difference:'),
    chalk.bold.yellow(stats.difference) ]);

  printHeader(data.month, dailyNorm);

  console.log(statsTable.toString());
  console.log();
}

module.exports = {
  print: printStats
};
