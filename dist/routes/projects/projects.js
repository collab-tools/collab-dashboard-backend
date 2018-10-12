'use strict';

var _ = require('lodash');
var boom = require('boom');
var moment = require('moment');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function getProject(req, res, next) {
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;

  var response = function response(project) {
    if (_.isNil(project)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(_.head(project));
  };

  return models.app.project.getProjectWithMembers(projectId).then(response)['catch'](next);
}

function getProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', 'start ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  req.checkQuery('end', 'end ' + String(constants.templates.error.invalidData)).isInt({ min: 0 });
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  var endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  var response = function response(projects) {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(projects);
  };

  return models.app.project.getProjectsWithMembers(startDate, endDate).then(response)['catch'](next);
}

function getUsers(req, res, next) {
  req.checkParams('projectId', 'projectId ' + String(constants.templates.error.missingParam)).notEmpty();
  var errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  var projectId = req.params.projectId;

  var response = function response(users) {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.app.project.getUsersOfProject(projectId).then(response)['catch'](next);
}

var teamsAPI = { getProject: getProject, getProjects: getProjects, getUsers: getUsers };

module.exports = teamsAPI;