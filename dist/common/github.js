'use strict';

var config = require('config');
var GitHub = require('github');
var Promise = require('bluebird');

var libConfig = {
  debug: true,
  protocol: 'https',
  Promise: Promise
};

var github = new GitHub(libConfig);
github.authenticate({
  type: 'oauth',
  key: config.get('github.client_id'),
  secret: config.get('github.client_secret')
});

module.exports = github;