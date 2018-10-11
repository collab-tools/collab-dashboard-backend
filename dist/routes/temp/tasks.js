'use strict';

var sequelize = require('./sequelizeHandler').sequelize;
var selectClause = require('./sequelizeHandler').selectClause;
console.log('Tasks Controller Initialized');

exports.getTasksCount = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var query = 'SELECT COUNT(*) as count FROM tasks' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(query, selectClause).then(function (result) {
    res.send(result[0]);
  }).catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getTasksPending = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var query = 'SELECT COUNT(*) as count FROM tasks' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ' AND completed_on IS NULL' + ';';
  sequelize.query(query, selectClause).then(function (result) {
    res.send(result[0]);
  }).catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getTasksCompleted = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var query = 'SELECT COUNT(*) as count FROM tasks' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ' AND completed_on IS NOT NULL' + ';';
  sequelize.query(query, selectClause).then(function (result) {
    res.send(result[0]);
  }).catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getCompleteTimeData = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var query = 'SELECT t.content as task_name, t.id as task_id' + ', TIMESTAMPDIFF(SECOND, t.created_at, t.completed_on) as time_taken' + ' FROM tasks t' + ' WHERE t.completed_on IS NOT NULL' + ' AND DATE(t.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ' GROUP BY t.id';

  sequelize.query(query, selectClause).then(function (result) {
    res.send({
      data: result
    });
  }).catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getFeatureUtilization = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  var queryTasks = 'SELECT COUNT(*) as count FROM tasks' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ' GROUP BY milestone_id' + ';';
  var queryMilestones = 'SELECT COUNT(*) as count FROM milestones' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(queryTasks, selectClause).then(function (resTasks) {
    sequelize.query(queryMilestones, selectClause).then(function (resMilestones) {
      var countTasks = resTasks.length;
      var countMilestones = resMilestones[0].count;
      var ratio = countTasks / countMilestones;
      if (countTasks === 0 || countMilestones === 0) {
        ratio = 0;
      }
      res.send({
        result: ratio
      });
    });
  }).catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};