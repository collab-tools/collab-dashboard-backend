'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getUserFiles(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveGoogleIdentity = function retrieveGoogleIdentity(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  var retrieveFiles = function retrieveFiles(email) {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getFiles(email, null, startDate, endDate);
  };

  var response = function response(files) {
    if (_.isNil(files)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.app.user.getUserById(userId).then(retrieveGoogleIdentity).then(retrieveFiles).then(response)['catch'](next);
}

function getUserChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveGoogleIdentity = function retrieveGoogleIdentity(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  var retrieveChanges = function retrieveChanges(email) {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserChanges(email, startDate, endDate);
  };

  var response = function response(changes) {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.app.user.getUserById(userId).then(retrieveGoogleIdentity).then(retrieveChanges).then(response)['catch'](next);
}

function getUserActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveGoogleIdentity = function retrieveGoogleIdentity(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  var retrieveActivities = function retrieveActivities(email) {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserActivities(email, startDate, endDate);
  };

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId).then(retrieveGoogleIdentity).then(retrieveActivities).then(response)['catch'](next);
}

function getProjectFiles(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveGoogleIdentity = function retrieveGoogleIdentity(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  var retrieveFiles = function retrieveFiles(email) {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getFiles(email, projectId, startDate, endDate);
  };

  var response = function response(files) {
    if (_.isNil(files)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.app.user.getUserById(userId).then(retrieveGoogleIdentity).then(retrieveFiles).then(response)['catch'](next);
}

function getProjectChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveGoogleIdentity = function retrieveGoogleIdentity(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  var retrieveChanges = function retrieveChanges(email) {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserChangesByProject(email, projectId, startDate, endDate);
  };

  var response = function response(changes) {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.app.user.getUserById(userId).then(retrieveGoogleIdentity).then(retrieveChanges).then(response)['catch'](next);
}

function getProjectActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('userId', 'userId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var userId = req.params.userId;
  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var retrieveGoogleIdentity = function retrieveGoogleIdentity(user) {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.email;
  };

  var retrieveActivities = function retrieveActivities(email) {
    if (_.isNil(email)) return next(boom.badRequest(constants.templates.error.badRequest));
    return models.log.file_log.getUserActivitiesByProject(email, projectId, startDate, endDate);
  };

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.app.user.getUserById(userId).then(retrieveGoogleIdentity).then(retrieveActivities).then(response)['catch'](next);
}

var driveAPI = {
  getUserFiles: getUserFiles,
  getUserChanges: getUserChanges,
  getUserActivities: getUserActivities,
  getProjectFiles: getProjectFiles,
  getProjectChanges: getProjectChanges,
  getProjectActivities: getProjectActivities
};

module.exports = driveAPI;