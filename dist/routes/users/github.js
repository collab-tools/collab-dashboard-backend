'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getUserRepos(req, res, next) {
  req.checkParams('userId', 'userId ' + constants.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;

  var retrieveRepos = function retrieveRepos(projects) {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.map(projects, function (project) {
      return _.pick(project, ['githubRepoName', 'githubRepoOwner']);
    });
  };

  var response = function response(repos) {
    if (_.isNil(repos)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(repos);
  };

  return models.app.user.getUserProjects(userId).then(retrieveRepos).then(response).catch(next);
}

function getUserCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveCommits = function retrieveCommits(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.commit_log.getUserCommits(user.githubLogin, null, startDate, endDate);
  };

  var response = function response(commmits) {
    if (_.isNil(commmits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commmits);
  };

  return models.app.user.getUserById(userId).then(retrieveCommits).then(response).catch(next);
}

function getUserReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveReleases = function retrieveReleases(projects) {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    var retrieval = [];
    _.forEach(projects, function (project) {
      retrieval.push(models.log.release_log.getProjectReleases(project.id, startDate, endDate));
    });
    return Promise.all(retrieval);
  };

  var response = function response(releases) {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.app.user.getUserProjects(userId).then(retrieveReleases).then(response).catch(next);
}

function getProjectRepo(req, res, next) {
  req.checkParams('userId', 'userId ' + constants.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + constants.templates.error.missingParam).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;

  var retrieveRepo = function retrieveRepo(project) {
    if (_.isNil(project)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.pick(project, ['githubRepoName', 'githubRepoOwner']);
  };

  var response = function response(repo) {
    if (_.isNil(repo)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(repo);
  };

  return models.app.project.findProjectById(projectId).then(retrieveRepo).then(response).catch(next);
}

function getProjectCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + constants.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveCommits = function retrieveCommits(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.commit_log.getUserCommits(user.githubLogin, projectId, startDate, endDate);
  };

  var response = function response(commits) {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.app.user.getUserById(userId).then(retrieveCommits).then(response).catch(next);
}

function getProjectReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + constants.templates.error.missingParam).notEmpty();
  req.checkParams('projectId', 'projectId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(releases) {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getProjectReleases(projectId, startDate, endDate).then(response).catch(next);
}

var githubAPI = {
  getUserRepos: getUserRepos,
  getUserCommits: getUserCommits,
  getUserReleases: getUserReleases,
  getProjectRepo: getProjectRepo,
  getProjectCommits: getProjectCommits,
  getProjectReleases: getProjectReleases
};

module.exports = githubAPI;