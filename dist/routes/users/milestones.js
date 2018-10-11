'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var Promise = require('bluebird');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getUserMilestones(req, res, next) {
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

  var retrieveMilestones = function retrieveMilestones(projects) {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    var retrieval = [];
    _.forEach(projects, function (project) {
      retrieval.push(models.app.milestone.getMilestonesByProject(project.id, startDate, endDate));
    });
    return Promise.all(retrieval);
  };

  var response = function response(milestones) {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    var groupedMilestones = _.chain(milestones).flatten().groupBy('id').value();

    res.status(200).json(groupedMilestones);
  };

  return models.app.user.getUserProjects(userId).then(retrieveMilestones).then(response).catch(next);
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

  var retrieveActivities = function retrieveActivities(projects) {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    var retrieval = [];
    _.forEach(projects, function (project) {
      retrieval.push(models.log.milestone_log.getUserProjectActivities(userId, project.id, startDate, endDate));
    });
    return Promise.all(retrieval);
  };

  var response = function response(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    var groupedActivities = _.chain(activities).flatten().groupBy('milestoneId').value();

    res.status(200).json(groupedActivities);
  };

  return models.app.user.getUserProjects(userId).then(retrieveActivities).then(response).catch(next);
}

function getAssignedUserMilestones(req, res, next) {
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

  var retrieveMilestonesInvolved = function retrieveMilestonesInvolved(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    var retrieval = [];
    _.chain(tasks).uniqBy('milestoneId').pick('milestoneId').compact().forEach(function (id) {
      retrieval.push(models.app.milestone.getMilestone(id));
    });
    return Promise.all(retrieval);
  };

  var response = function response(milestones) {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return models.app.task.getTasksByAssignee(userId, null, startDate, endDate).then(retrieveMilestonesInvolved).then(response).catch(next);
}

function getTasksByMilestones(req, res, next) {
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

  var groupByMilestone = function groupByMilestone(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  var response = function response(groupedTasks) {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByAssignee(userId, null, startDate, endDate).then(groupByMilestone).then(response).catch(next);
}

function getAssignedProjectMilestones(req, res, next) {
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

  var retrieveMilestonesInvolved = function retrieveMilestonesInvolved(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    var retrieval = [];
    _.chain(tasks).uniqBy('milestoneId').pick('milestoneId').compact().forEach(function (id) {
      retrieval.push(models.app.milestone.getMilestone(id));
    });
    return Promise.all(retrieval);
  };

  var response = function response(milestones) {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return models.app.task.getTasksByAssignee(userId, projectId, startDate, endDate).then(retrieveMilestonesInvolved).then(response).catch(next);
}

function getActivitiesByProjectMilestones(req, res, next) {
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

  var groupByMilestone = function groupByMilestone(tasks) {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  var response = function response(groupedTasks) {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasksByAssignee(userId, projectId, startDate, endDate).then(groupByMilestone).then(response).catch(next);
}

function getTasksByProjectMilestones(req, res, next) {
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

  var groupByMilestone = function groupByMilestone(activities) {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(activities, 'milestoneId');
  };

  var response = function response(groupedActivities) {
    if (_.isNil(groupedActivities)) {
      return next(boom.badRequest(constants.templates.error.badRequest));
    }
    res.status(200).json(groupedActivities);
  };

  return models.log.milestone_log.getUserProjectActivities(userId, projectId, startDate, endDate).then(groupByMilestone).then(response).catch(next);
}

var milestonesAPI = {
  getUserMilestones: getUserMilestones,
  getUserActivities: getUserActivities,
  getAssignedUserMilestones: getAssignedUserMilestones,
  getTasksByMilestones: getTasksByMilestones,
  getAssignedProjectMilestones: getAssignedProjectMilestones,
  getActivitiesByProjectMilestones: getActivitiesByProjectMilestones,
  getTasksByProjectMilestones: getTasksByProjectMilestones
};

module.exports = milestonesAPI;