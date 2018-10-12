const _ = require('lodash');
const boom = require('boom');
const moment = require('moment');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');

const models = new Storage();

function getProject(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const response = (project) => {
    if (_.isNil(project)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(_.head(project));
  };

  return models.app.project.getProjectWithMembers(projectId)
    .then(response)
    .catch(next);
}

function getProjects(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (projects) => {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(projects);
  };

  return models.app.project.getProjectsWithMembers(startDate, endDate)
    .then(response)
    .catch(next);
}

function getUsers(req, res, next) {
  req.checkParams('projectId', `projectId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const projectId = req.params.projectId;

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.app.project.getUsersOfProject(projectId)
    .then(response)
    .catch(next);
}

function getProjectsCount (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query = 'SELECT COUNT(*) as count FROM projects'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';
  models.app.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

function getNumProjectsCreatedBetweenDates(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedProjectsQuery = 'SELECT COUNT (*) as count FROM projects '
  + 'WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  models.app.query(datedProjectsQuery, selectClause)
    .then((projects) => {
      res.send(projects[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

function getLatestProjects(req, res) {
  let maxProjects = req.body.maxProjects;
  if (!maxProjects) maxProjects = 10;

  const query =
  'SELECT p.content, p.github_repo_name, p.created_at, GROUP_CONCAT(display_name) as members, p.id as project_id '
  + ' FROM projects p'
  + ' JOIN user_projects up ON up.project_id = p.id'
  + ' JOIN users u ON up.user_id = u.id'
  + ' GROUP BY p.id'
  + ' ORDER BY DATE(p.created_at) DESC LIMIT ' + maxProjects
  + ';';

  models.app.query(query, selectClause)
    .then((result) => {
      res.send(result);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

//Not very accurate as we determine 'active' via updated_at
function getProjectsActiveRateBetweenDates(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const totalQuery = 'SELECT COUNT(*) as count FROM projects ';
  const activeQuery = 'SELECT COUNT(*) as count FROM projects '
  + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  models.app.query(totalQuery, selectClause)
    .then((resultsTotal) => {
      sequelize.query(activeQuery, selectClause)
        .then((resultsActive) => {
          let totalCount = resultsTotal[0].count;
          let activeCount = resultsActive[0].count;
          let rate = activeCount / totalCount;
          res.send({"rate": rate});
      });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

function getMilestones(req, res) {
  const projectId = req.body.projectId;

  const query =
  'SELECT m.content as milestone_name, m.id as milestone_id'
  + ', SUM(CASE WHEN t.completed_on IS NOT NULL THEN 1 ELSE 0 END) as num_tasks_completed'
  + ', SUM(CASE WHEN t.completed_on IS NULL THEN 1 ELSE 0 END) as num_tasks_incomplete'
  + ' FROM milestones m, tasks t'
  + ' WHERE m.id = t.milestone_id'
  + ' AND m.project_id = \'' + projectId + '\''
  + ' GROUP BY m.id';

  models.app.query(query, selectClause)
    .then((result) => {
      res.send(result);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

const teamsAPI = { getProject, getProjects, getUsers,
  getProjectsCount, 
  getNumProjectsCreatedBetweenDates,
  getLatestProjects, 
  getProjectsActiveRateBetweenDates, 
  getMilestones, };

module.exports = teamsAPI;
