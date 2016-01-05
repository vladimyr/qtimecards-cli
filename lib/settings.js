'use strict';

var Promise = require('bluebird');
var Path = require('path');
var _ = require('lodash');
var userHome = require('user-home');
var fs = Promise.promisifyAll(require('fs'));
var mkdirp = Promise.promisify(require('mkdirp'));

var defaultConfig = require('../config.json');
var storagePath = Path.join(userHome, '.qtimecards');
var configPath = Path.join(storagePath, '/config.json');


var _config;

function initConfig() {
  return fs.writeFileAsync(configPath,
    JSON.stringify(defaultConfig, null, 2));
}

function overrideConfig(config) {
  _config = _.defaults(config, defaultConfig);
  return _config;
}

function loadConfig() {
  return fs.readFileAsync(configPath)
    .call('toString')
    .then(JSON.parse)
    .catchReturn({})
    .then(overrideConfig);
}

function setupStorage() {
  return mkdirp(storagePath)
    .then(initConfig);
}

function getStorage() {
  return fs.statAsync(storagePath)
    .catch({ code: 'ENOENT'}, setupStorage)
    .thenReturn(storagePath);
}

module.exports = {
  getStoragePath: getStorage,
  load: loadConfig
};
