const config = require('config');
const GitHub = require('github');
const Promise = require('bluebird');

const libConfig = {
  debug: true,
  protocol: 'https',
  Promise
};

const github = new GitHub(libConfig);
github.authenticate({
  type: 'oauth',
  key: config.get('github.client_id'),
  secret: config.get('github.client_secret')
});

export default github;
