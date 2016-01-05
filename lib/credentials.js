'use strict';

var Promise = require('bluebird');
var Path = require('path');
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs'));
var simplecrypt = require('simplecrypt');
var settings = require('./settings.js');

var sc = simplecrypt({
  password: 'jTbmLxehekcvf#htynfgri9caotlbkmM',
  salt: 'qtimecards-user-credentials'
});

function toString(buffer) {
  return buffer.toString();
}

var encrypt = _.compose(sc.encrypt, JSON.stringify);
var decrypt = _.compose(JSON.parse, sc.decrypt, toString);

function check(data) {
  if (!data.username || !data.password || !data.userId)
    throw new Error('Invalid credentials!');

  return data;
}

function getCredentialsStoragePath() {
  return settings.getStoragePath()
    .then(function complete(storagePath) {
      return Path.join(storagePath, '/credentials.enc');
    });
}

function writeCredentials(encryptedData) {
  return getCredentialsStoragePath()
    .then(function complete(storagePath) {
      return fs.writeFileAsync(storagePath, encryptedData);
    });
}

function readCredentials() {
  return getCredentialsStoragePath()
    .then(function complete(storagePath) {
      return fs.readFileAsync(storagePath);
    });
}

function cleanCredentials() {
  return getCredentialsStoragePath()
    .then(function complete(storagePath) {
      return fs.unlinkAsync(storagePath);
    });
}

function store(data) {
  return Promise.resolve(check(data))
    .then(encrypt)
    .then(writeCredentials);
}

function retrieve() {
  return readCredentials()
    .then(decrypt)
    .then(check);
}

module.exports = {
  store: store,
  retrieve: retrieve,
  clean: cleanCredentials
};
