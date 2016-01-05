'use strict';

var chalk = require('chalk');
var Table = require('cli-table');


function createTable(col1, col2, col3) {
  return new Table({
    head: [
      chalk.cyan(col1),
      chalk.cyan(col2),
      chalk.cyan(col3)
    ],
    colAligns: [
      'left',
      'left',
      'left'
    ]
  });
}

function printVacationInfo(data) {
  var categoryTable = createTable('Old', 'New', 'Additional');
  var usageTable = createTable('Used', 'Unused', 'Total');

  categoryTable.push([
    data.category.old,
    data.category.new,
    data.category.additional
  ]);

  usageTable.push([
    data.usage.used,
    data.usage.unused,
    chalk.bold.yellow(data.usage.total)
  ]);

  console.log();

  console.log(' Vacation categories:');
  console.log(categoryTable.toString());
  console.log();

  console.log(' Vacation usage:');
  console.log(usageTable.toString());
  console.log();

  if (data.notes) {
    console.log(chalk.bold(' Notes:'), data.notes);
    console.log();
  }
}

module.exports = {
  print: printVacationInfo
};
