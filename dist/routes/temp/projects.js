'use strict';

var sequelize = require('./sequelizeHandler').sequelize;
var selectClause = require('./sequelizeHandler').selectClause;
console.log('Projects Controller Initialized');

exports.getProjectsCount = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var query = 'SELECT COUNT(*) as count FROM projects' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(query, selectClause).then(function (result) {
    res.send(result[0]);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getNumProjectsCreatedBetweenDates = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var datedProjectsQuery = 'SELECT COUNT (*) as count FROM projects ' + 'WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(datedProjectsQuery, selectClause).then(function (projects) {
    res.send(projects[0]);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getLatestProjects = function (req, res) {
  var maxProjects = req.body.maxProjects;
  if (!maxProjects) maxProjects = 10;

  var query = 'SELECT p.content, p.github_repo_name, p.created_at, GROUP_CONCAT(display_name) as members, p.id as project_id ' + ' FROM projects p' + ' JOIN user_projects up ON up.project_id = p.id' + ' JOIN users u ON up.user_id = u.id' + ' GROUP BY p.id' + ' ORDER BY DATE(p.created_at) DESC LIMIT ' + maxProjects + ';';

  sequelize.query(query, selectClause).then(function (result) {
    res.send(result);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

//Not very accurate as we determine 'active' via updated_at
exports.getProjectsActiveRateBetweenDates = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var totalQuery = 'SELECT COUNT(*) as count FROM projects ';
  var activeQuery = 'SELECT COUNT(*) as count FROM projects ' + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(totalQuery, selectClause).then(function (resultsTotal) {
    sequelize.query(activeQuery, selectClause).then(function (resultsActive) {
      var totalCount = resultsTotal[0].count;
      var activeCount = resultsActive[0].count;
      var rate = activeCount / totalCount;
      res.send({ "rate": rate });
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getMilestones = function (req, res) {
  var projectId = req.body.projectId;

  var query = 'SELECT m.content as milestone_name, m.id as milestone_id' + ', SUM(CASE WHEN t.completed_on IS NOT NULL THEN 1 ELSE 0 END) as num_tasks_completed' + ', SUM(CASE WHEN t.completed_on IS NULL THEN 1 ELSE 0 END) as num_tasks_incomplete' + ' FROM milestones m, tasks t' + ' WHERE m.id = t.milestone_id' + ' AND m.project_id = \'' + projectId + '\'' + ' GROUP BY m.id';

  sequelize.query(query, selectClause).then(function (result) {
    res.send(result);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};