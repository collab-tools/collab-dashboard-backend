'use strict';

var _ = require('lodash');
var archiver = require('archiver');
var boom = require('boom');
var download = require('download');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');
var fs = require('fs');

var models = new Storage();

function getRepositories(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(repos) {
    if (_.isNil(repos)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(repos);
  };

  return models.app.project.getRepositories(startDate, endDate).then(response).catch(next);
}

function getCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(commits) {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getCommits(startDate, endDate).then(response).catch(next);
}

function getCommit(req, res, next) {
  req.checkParams('commitId', 'commitId ' + constants.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var commitId = req.params.commitId;
  var response = function response(commit) {
    if (_.isNil(commit)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commit);
  };

  return models.log.commit_log.getCommit(commitId).then(response).catch(next);
}

function getReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(releases) {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getReleases(startDate, endDate).then(response).catch(next);
}

function getRelease(req, res, next) {
  req.checkParams('releaseId', 'releaseId ' + constants.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var releaseId = req.params.releaseId;
  var response = function response(release) {
    if (_.isNil(release)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(release);
  };

  return models.log.release_log.getRelease(releaseId).then(response).catch(next);
}

function getParticipatingUsers(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(users) {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.commit_log.getParticipatingUsers(startDate, endDate).then(response).catch(next);
}

function getParticipatingProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(users) {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.commit_log.getParticipatingProjects(startDate, endDate).then(response).catch(next);
}

function downloadAssets(req, res, next) {
  var releases = JSON.parse(req.query.releases);
  var archive = archiver('zip');
  archive.on('error', function (err) {
    res.status(500).send({ error: err.message });
  });
  archive.on('end', function () {
    console.log('Archive wrote %d bytes', archive.pointer());
  });
  res.attachment('releases-assets.zip');

  // flatten assets
  var assets = [];
  _.forEach(releases, function (release) {
    _.forEach(release.assets, function (asset) {
      assets.push({
        fileName: asset,
        directory: release.owner + '-' + release.repo + '-' + release.tagName,
        url: 'https://github.com/' + release.owner + '/' + release.repo + '/releases/download/' + release.tagName + '/' + asset
      });
    });
  });

  Promise.all(_.map(assets, function (asset) {
    return download(asset.url);
  })).then(function (payload) {
    // download files
    archive.pipe(res);
    _.forEach(assets, function (asset, index) {
      archive.append(payload[index], { name: asset.directory + '/' + asset.fileName });
    });
    archive.finalize();
  });
}

var githubAPI = {
  getRepositories: getRepositories,
  getCommits: getCommits,
  getCommit: getCommit,
  getReleases: getReleases,
  getRelease: getRelease,
  getParticipatingUsers: getParticipatingUsers,
  getParticipatingProjects: getParticipatingProjects,
  downloadAssets: downloadAssets
};

module.exports = githubAPI;