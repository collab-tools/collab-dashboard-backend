const _ = require('lodash');
const archiver = require('archiver');
const boom = require('boom');
const download = require('download');
const moment = require('moment');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');
const fs = require('fs');

const models = new Storage();

function getRepositories(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (repos) => {
    if (_.isNil(repos)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(repos);
  };

  return models.app.project.getRepositories(startDate, endDate)
    .then(response)
    .catch(next);
}

function getCommits(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (commits) => {
    if (_.isNil(commits)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commits);
  };

  return models.log.commit_log.getCommits(startDate, endDate)
    .then(response)
    .catch(next);
}

function getCommit(req, res, next) {
  req.checkParams('commitId', `commitId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const commitId = req.params.commitId;
  const response = (commit) => {
    if (_.isNil(commit)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(commit);
  };

  return models.log.commit_log.getCommit(commitId)
    .then(response)
    .catch(next);
}

function getReleases(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (releases) => {
    if (_.isNil(releases)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(releases);
  };

  return models.log.release_log.getReleases(startDate, endDate)
    .then(response)
    .catch(next);
}

function getRelease(req, res, next) {
  req.checkParams('releaseId', `releaseId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const releaseId = req.params.releaseId;
  const response = (release) => {
    if (_.isNil(release)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(release);
  };

  return models.log.release_log.getRelease(releaseId)
    .then(response)
    .catch(next);
}

function getParticipatingUsers(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.commit_log.getParticipatingUsers(startDate, endDate)
    .then(response)
    .catch(next);
}

function getParticipatingProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.commit_log.getParticipatingProjects(startDate, endDate)
    .then(response)
    .catch(next);
}

function downloadAssets(req, res, next) {
  const releases = JSON.parse(req.query.releases);
  const archive = archiver('zip');
  archive.on('error', (err) => {
    res.status(500).send({ error: err.message });
  });
  archive.on('end', () => {
    console.log('Archive wrote %d bytes', archive.pointer());
  });
  res.attachment('releases-assets.zip');

  // flatten assets
  const assets = [];
  _.forEach(releases, (release) => {
    _.forEach(release.assets, (asset) => {
      assets.push({
        fileName: asset,
        directory: `${release.owner}-${release.repo}-${release.tagName}`,
        url: `https://github.com/${release.owner}/${release.repo}/releases/download/${release.tagName}/${asset}`
      });
    });
  });


  Promise.all(_.map(assets, asset => download(asset.url)))
    .then((payload) => {
      // download files
      archive.pipe(res);
      _.forEach(assets, (asset, index) => {
        archive.append(payload[index], { name: `${asset.directory}/${asset.fileName}` });
      });
      archive.finalize();
    });
}

const githubAPI = {
  getRepositories,
  getCommits,
  getCommit,
  getReleases,
  getRelease,
  getParticipatingUsers,
  getParticipatingProjects,
  downloadAssets
};

module.exports = githubAPI;
