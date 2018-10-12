'use strict';

var sequelize = require('./sequelizeHandler').sequelize;
var selectClause = require('./sequelizeHandler').selectClause;
console.log('Milestones Controller Initialized');

exports.getMilestonesCount = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var query = 'SELECT COUNT(*) as count FROM milestones' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(query, selectClause).then(function (result) {
    var count = result[0].count;
    res.send({
      count: count
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getCompletedMilestonesCount = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var query = 'SELECT (COUNT (m.id) - ' + ' (SELECT COUNT(DISTINCT(m2.id)) FROM milestones m2 ' + ' INNER JOIN tasks t ON m2.id = t.milestone_id AND t.completed_on IS NULL' + ' WHERE DATE(m2.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ')) AS count ' + ' FROM milestones m ' + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(query, selectClause).then(function (result) {
    console.log(JSON.stringify(result));
    var count = result[0].count;
    res.send({
      count: count
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getAverageMilestonesPerProject = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var queryMilestones = 'SELECT COUNT(*) as count ' + ' FROM milestones m ' + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  var queryProjects = 'SELECT COUNT(*) as count ' + ' FROM projects p ' + ' WHERE DATE(p.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(queryMilestones, selectClause).then(function (resultMilestones) {

    sequelize.query(queryProjects, selectClause).then(function (resultProjects) {

      var countMilestones = resultMilestones[0].count;
      var countProjects = resultProjects[0].count;
      var milestonesPerProject = countMilestones / countProjects;
      if (countMilestones === 0 || countProjects === 0) {
        milestonesPerProject = 0;
      }
      res.send({
        result: milestonesPerProject
      });
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getAverageTasksPerMilestone = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var queryMilestones = 'SELECT COUNT(*) as count ' + ' FROM milestones m ' + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  var queryTasks = 'SELECT COUNT(*) as count ' + ' FROM tasks t ' + ' WHERE DATE(t.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(queryMilestones, selectClause).then(function (resultMilestones) {

    sequelize.query(queryTasks, selectClause).then(function (resultTasks) {

      var countMilestones = resultMilestones[0].count;
      var countTasks = resultTasks[0].count;
      var tasksPerMilestone = countTasks / countMilestones;
      if (countMilestones === 0 || countTasks === 0) {
        tasksPerMilestone = 0;
      }
      res.send({
        result: tasksPerMilestone
      });
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getTimeTakenData = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var query = 'SELECT m.content as milestone_name, m.id as milestone_id' + ', SUM(TIMESTAMPDIFF(SECOND, t.created_at, t.completed_on)) as time_taken' + ' FROM milestones m ' + ' INNER JOIN tasks t ON m.id = t.milestone_id AND t.completed_on IS NOT NULL' + ' WHERE m.id = t.milestone_id' + ' AND DATE(t.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ' GROUP BY m.id';

  sequelize.query(query, selectClause).then(function (result) {
    res.send({
      data: result
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getRatioDeadlinesMissed = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var queryTotalMilestones = 'SELECT COUNT(*) as count FROM milestones' + ' WHERE DATE(created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  var queryMissedDeadlines = ' SELECT COUNT(*) as count FROM milestones m2, tasks t' + ' WHERE m2.id = t.milestone_id ' + ' AND m2.deadline IS NOT NULL' + ' AND (t.completed_on IS NULL OR t.completed_on > m2.deadline)' + ';';

  sequelize.query(queryMissedDeadlines, selectClause).then(function (resultMissedDeadlines) {
    sequelize.query(queryTotalMilestones, selectClause).then(function (resultTotalMilestones) {
      var countMissedDeadlines = resultMissedDeadlines[0].count;
      var countTotalMilestones = resultTotalMilestones[0].count;
      var ratio = countMissedDeadlines / countTotalMilestones;
      if (countMissedDeadlines === 0 || countTotalMilestones === 0) {
        ratio = 0;
      }
      res.send({
        result: ratio
      });
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getFeatureUtilization = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var queryTotalProjects = 'SELECT COUNT(*) as count from projects p' + ' WHERE DATE(p.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  var queryMilestones = 'SELECT COUNT(*) as count from milestones m' + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate + '\' AND \'' + endDate + '\'' + ' GROUP BY m.project_id' + ';';

  sequelize.query(queryTotalProjects, selectClause).then(function (resultTotalProjects) {

    sequelize.query(queryMilestones, selectClause).then(function (resultMilestones) {
      var countMilestones = resultMilestones.length;
      var countTotalProjects = resultTotalProjects[0].count;
      var featureRatio = countMilestones / countTotalProjects;
      if (countMilestones === 0 || countTotalProjects === 0) {
        featureRatio = 0;
      }
      res.send({
        result: featureRatio
      });
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};