#!/usr/bin/env node

'use strict';

var program = require('commander');
var chalk = require('chalk');
var glob = require('glob');
var didYouMean = require('didyoumean');
var Path = require('path');
var multiline = require('multiline');
var registerCommand = require('../lib/registerCommand.js');

var pkg = require('../package.json');
var version = pkg.version;

var description = chalk.magenta(multiline(function(){/*

  This command line utility interacts with qtimecards server providing you with
  shortcuts for performing common qtimecards related tasks.
*/}));

program.version(version);
program.description(description);

function reportCommandError(err) {
  console.error(chalk.bold.red('Error:'), err.message);
}

var commands = glob.sync(Path.join(__dirname, '../commands/*.js'));
var commandNames = commands.map(function(path) {
  var command = require(path);
  return registerCommand(program, command, reportCommandError);
});

program.action(function(cmd) {
  console.error(chalk.bold.red('Error:'),
    chalk.bold(cmd), 'is not a qtime command');

  var suggestion = didYouMean(cmd, commandNames);
  if (suggestion)
    console.error('Did you mean', chalk.bold(suggestion) + '?');

  process.exit(1);
});

program.parse(process.argv);

if (!program.args.length)
  program.help();
