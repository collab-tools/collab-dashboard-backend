'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getUserTasks(req, res, next) {
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

  var response = function response(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.task.getTasksByAssignee(userId, null, startDate, endDate).then(response).catch(next);
}

function getUserActivities(req, res, next) {
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

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getUserActivities(userId, startDate, endDate).then(response).catch(next);
}

function getProjectTasks(req, res, next) {
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

  var response = function response(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(tasks);
  };

  return models.app.task.getTasksByAssignee(userId, projectId, startDate, endDate).then(response).catch(next);
}

function getProjectActivities(req, res, next) {
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

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.task_log.getUserActivitiesByProject(userId, projectId, startDate, endDate).then(response).catch(next);
}

var tasksAPI = {
  getUserTasks: getUserTasks,
  getUserActivities: getUserActivities,
  getProjectTasks: getProjectTasks,
  getProjectActivities: getProjectActivities
};

module.exports = tasksAPI;