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
  req.checkParams('projectId', 'projectId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(files) {
    if (_.isNil(files)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(files);
  };

  return models.log.file_log.getFiles(null, projectId, startDate, endDate).then(response).catch(next);
}

function getChanges(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(changes) {
    if (_.isNil(changes)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(changes);
  };

  return models.log.file_log.getProjectChanges(projectId, startDate, endDate).then(response).catch(next);
}

function getActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + constants.templates.error.missingParam).notEmpty();
  req.checkQuery('start', 'start ' + constants.templates.error.invalidData).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + constants.templates.error.invalidData).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.file_log.getProjectActivities(projectId, startDate, endDate).then(response).catch(next);
}

var driveAPI = {
  getFiles: getFiles,
  getChanges: getChanges,
  getActivities: getActivities
};

module.exports = driveAPI;