const _ = require('lodash');
const boom = require('boom');
const moment = require('moment');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');

const models = new Storage();

function getMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  if (req.query.elapsed) {
    req.checkQuery('elapsed', `elapsed ${constants.templates.error.invalidData}`).isBoolean();
  }
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });

  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const elapsed = JSON.parse(req.query.elapsed);
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');
  const evalQuery = () => {
    if (elapsed) return models.app.milestone.getElapsedMilestones(startDate, endDate);
    return models.app.milestone.getMilestones(startDate, endDate);
  };
  const response = (milestones) => {
    if (_.isNil(milestones)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestones);
  };

  return evalQuery()
    .then(response)
    .catch(next);
}

function getMilestone(req, res, next) {
  req.checkParams('milestoneId', `milestoneId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const milestoneId = req.params.milestoneId;
  const response = (milestone) => {
    if (_.isNil(milestone)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(milestone);
  };

  return models.app.milestone.getMilestone(milestoneId)
    .then(response)
    .catch(next);
}

function getActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.milestone_log.getActivities(startDate, endDate)
    .then(response)
    .catch(next);
}

function getMilestoneActivities(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkParams('milestoneId', `milestoneId ${constants.templates.error.missingParam}`).notEmpty();
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const milestoneId = req.params.milestoneId;
  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (activities) => {
    if (_.isNil(activities)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(activities);
  };

  return models.log.milestone_log.getMilestoneActivities(milestoneId, startDate, endDate)
    .then(response)
    .catch(next);
}

function getTasksByMilestones(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const groupByMilestone = (tasks) => {
    if (_.isNil(tasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    return _.groupBy(tasks, 'milestoneId');
  };

  const response = (groupedTasks) => {
    if (_.isNil(groupedTasks)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(groupedTasks);
  };

  return models.app.task.getTasks(startDate, endDate)
    .then(groupByMilestone)
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

  return models.log.milestone_log.getParticipatingUsers(startDate, endDate)
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

  return models.log.milestone_log.getParticipatingProjects(startDate, endDate)
    .then(response)
    .catch(next);
}

const milestonesAPI = {
  getMilestones,
  getMilestone,
  getActivities,
  getMilestoneActivities,
  getTasksByMilestones,
  getParticipatingUsers,
  getParticipatingProjects
};

module.exports = milestonesAPI;
