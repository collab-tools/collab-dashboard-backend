'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  if (req.query.elapsed) {
    req.checkQuery('elapsed', 'elapsed ' + String(constants.templates.error.invalidData)).isBoolean();
  }
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var elapsed = JSON.parse(req.query.elapsed);
  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');
  var evalQuery = function evalQuery() {
    if (elapsed) {
      return models.app.milestone.getElapsedMilestonesByProject(projectId, startDate, endDate);
    }
    return models.app.milestone.getMilestonesByProject(projectId, startDate, endDate);
  };
  var response = function response(milestones) {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return evalQuery().then(response)['catch'](next);
}

function getActivities(req, res, next) {
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

  var response = function response(milestonesActivities) {
    if (_.isNil(milestonesActivities)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    res.status(200).json(milestonesActivities);
  };

  return models.log.milestone_log.getProjectActivities(projectId, startDate, endDate).then(response)['catch'](next);
}

function getTasksByMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  var projectId = req.params.projectId;
  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var groupByMilestone = function groupByMilestone(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  var response = function response(groupedTasks) {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByProject(projectId, startDate, endDate).then(groupByMilestone).then(response)['catch'](next);
}

var milestonesAPI = { getMilestones: getMilestones, getActivities: getActivities, getTasksByMilestones: getTasksByMilestones };

module.exports = milestonesAPI;