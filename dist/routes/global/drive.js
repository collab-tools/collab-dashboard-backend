'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getFiles(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(files) {
    if (_.isNil(files)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.log.file_log.getFiles(null, null, startDate, endDate).then(response)['catch'](next);
}

function getFile(req, res, next) {
  req.checkParams('fileId', 'fileId ' + String(constants.templates.error.missingParam)).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var fileId = req.params.fileId;
  var response = function response(file) {
    if (_.isNil(file)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(file);
  };

  return models.log.file_log.getFile(fileId).then(response)['catch'](next);
}

function getChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(changes) {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.log.file_log.getChanges(startDate, endDate).then(response)['catch'](next);
}

function getFileChanges(req, res, next) {
  req.checkParams('fileId', 'fileId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var fileId = req.params.fileId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(changes) {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.log.file_log.getFileChanges(fileId, startDate, endDate).then(response)['catch'](next);
}

function getActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.file_log.getActivities(startDate, endDate).then(response)['catch'](next);
}

function getFileActivities(req, res, next) {
  req.checkParams('fileId', 'fileId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var fileId = req.params.fileId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.file_log.getFileActivities(fileId, startDate, endDate).then(response)['catch'](next);
}

function getParticipatingUsers(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(users) {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.file_log.getParticipatingUsers(startDate, endDate).then(response)['catch'](next);
}

function getParticipatingProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(users) {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.log.file_log.getParticipatingProjects(startDate, endDate).then(response)['catch'](next);
}

var driveAPI = {
  getFiles: getFiles,
  getFile: getFile,
  getChanges: getChanges,
  getFileChanges: getFileChanges,
  getActivities: getActivities,
  getFileActivities: getFileActivities,
  getParticipatingUsers: getParticipatingUsers,
  getParticipatingProjects: getParticipatingProjects
};

module.exports = driveAPI;