'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var github = require('../../common/github');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getRepo(req, res, next) {
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;

  var response = function response(project) {
    if (_.isNil(project) || _.isNil(project.githubRepoName) || _.isNil(project.githubRepoOwner)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }

    var payload = {
      githubRepoName: project.githubRepoName,
      githubRepoOwner: project.githubRepoOwner
    };

    res.status(200).json(payload);
  };

  return models.app.project.findProjectById(projectId).then(response)['catch'](next);
}

function getCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(commits) {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getProjectCommits(projectId, startDate, endDate).then(response)['catch'](next);
}

function getReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(releases) {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getProjectReleases(projectId, startDate, endDate).then(response)['catch'](next);
}

function getContributors(req, res, next) {
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;

  var retrieveRepo = function retrieveRepo(project) {
    if (_.isNil(project) || _.isNil(project.githubRepoName) || _.isNil(project.githubRepoOwner)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    return { owner: project.githubRepoOwner, repo: project.githubRepoName };
  };

  var response = function response(contributors) {
    if (_.isNil(contributors)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(contributors);
  };

  return models.app.project.findProjectById(projectId).then(retrieveRepo).then(github.repos.getStatsContributors).then(response)['catch'](next);
}

function getStatistics(req, res, next) {
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;

  var retrieveRepo = function retrieveRepo(project) {
    if (_.isNil(project) || _.isNil(project.githubRepoName) || _.isNil(project.githubRepoOwner)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    return { owner: project.githubRepoOwner, repo: project.githubRepoName };
  };

  var retrieveStats = function retrieveStats(repo) {
    return Promise.all([github.repos.getStatsCommitActivity(repo), github.repos.getStatsCodeFrequency(repo)]);
  };

  var response = function response(stats) {
    if (_.isNil(stats)) return next(boom.badRequest(constants.templates.error.badRequest));
    var payload = { commits: stats[0], codes: stats[1] };
    res.status(200).json(payload);
  };

  return models.app.project.findProjectById(projectId).then(retrieveRepo).then(retrieveStats).then(response)['catch'](next);
}

var githubAPI = {
  getRepo: getRepo,
  getCommits: getCommits,
  getReleases: getReleases,
  getContributors: getContributors,
  getStatistics: getStatistics
};

module.exports = githubAPI;