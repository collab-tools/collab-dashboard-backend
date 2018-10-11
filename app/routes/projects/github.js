const _ = require('lodash');
const boom = require('boom');
const moment = require('moment');
const github = require('../../common/github');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');

const models = new Storage();

function getRepo(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const response = (project) => {
    if (_.isNil(project) || _.isNil(project.githubRepoName) || _.isNil(project.githubRepoOwner)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }

    const payload = {
      githubRepoName: project.githubRepoName,
      githubRepoOwner: project.githubRepoOwner
    };

    res.status(200).json(payload);
  };

  return models.app.project.findProjectById(projectId)
    .then(response)
    .catch(next);
}

function getCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (commits) => {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getProjectCommits(projectId, startDate, endDate)
    .then(response)
    .catch(next);
}

function getReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (releases) => {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getProjectReleases(projectId, startDate, endDate)
    .then(response)
    .catch(next);
}

function getContributors(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const retrieveRepo = (project) => {
    if (_.isNil(project) || _.isNil(project.githubRepoName) || _.isNil(project.githubRepoOwner)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    return { owner: project.githubRepoOwner, repo: project.githubRepoName };
  };

  const response = (contributors) => {
    if (_.isNil(contributors)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(contributors);
  };

  return models.app.project.findProjectById(projectId)
    .then(retrieveRepo)
    .then(github.repos.getStatsContributors)
    .then(response)
    .catch(next);
}

function getStatistics(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const retrieveRepo = (project) => {
    if (_.isNil(project) || _.isNil(project.githubRepoName) || _.isNil(project.githubRepoOwner)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    return { owner: project.githubRepoOwner, repo: project.githubRepoName };
  };

  const retrieveStats = (repo) => {
    return Promise.all([
      github.repos.getStatsCommitActivity(repo),
      github.repos.getStatsCodeFrequency(repo)
    ]);
  };

  const response = (stats) => {
    if (_.isNil(stats)) return next(boom.badRequest(constants.templates.error.badRequest));
    const payload = { commits: stats[0], codes: stats[1] };
    res.status(200).json(payload);
  };

  return models.app.project.findProjectById(projectId)
    .then(retrieveRepo)
    .then(retrieveStats)
    .then(response)
    .catch(next);
}

const githubAPI = {
  getRepo,
  getCommits,
  getReleases,
  getContributors,
  getStatistics
};

module.exports = githubAPI;
