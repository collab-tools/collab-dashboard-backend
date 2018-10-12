'use strict';

var sequelize = require('./sequelizeHandler').sequelize;
var selectClause = require('./sequelizeHandler').selectClause;
console.log('Users Controller Initialized');

exports.getUsersCount = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var query = 'SELECT COUNT(*) as count FROM users' + ' WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';
  sequelize.query(query, selectClause).then(function (result) {
    console.log('result = ' + JSON.stringify(selectClause));
    var count = result[0].count;
    res.send({
      count: count
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getNumUsersCreatedBetweenDates = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var datedUsersQuery = 'SELECT COUNT (*) as count FROM users ' + 'WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(datedUsersQuery, selectClause).then(function (users) {
    res.send(users[0]);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getNumUsersUpdatedBetweenDates = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var datedUsersQuery = 'SELECT COUNT (*) as count FROM users ' + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(datedUsersQuery, selectClause).then(function (users) {
    res.send(users[0]);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getTotalMinusNumUsersUpdatedBetweenDates = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var datedUsersQuery = 'SELECT COUNT (*) as count FROM users ' + 'WHERE NOT DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(datedUsersQuery, selectClause).then(function (users) {
    res.send(users[0]);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getUsersRetentionRate = function (req, res) {
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;

  var totalUsersQuery = 'SELECT COUNT (*) as count FROM users';
  var datedUsersQuery = 'SELECT COUNT (*) as count FROM users ' + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\'' + ';';

  sequelize.query(totalUsersQuery, selectClause).then(function (total) {
    sequelize.query(datedUsersQuery, selectClause).then(function (active) {
      var totalCount = total[0].count;
      var numActive = active[0].count;
      var rate = numActive / totalCount;
      res.send({
        rate: rate
      });
    });
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getLatestUsers = function (req, res) {
  var maxUsers = req.body.maxUsers;
  if (!maxUsers) maxUsers = 10;

  var datedUsersQuery = 'SELECT u.display_name, u.email, u.github_login, u.created_at, GROUP_CONCAT(content) as user_projects, u.id as user_id ' + ' FROM users u' + ' JOIN user_projects up ON up.user_id = u.id' + ' JOIN projects p ON up.project_id = p.id' + ' GROUP BY u.id' + ' ORDER BY DATE(u.created_at) DESC LIMIT ' + maxUsers + ';';

  sequelize.query(datedUsersQuery, selectClause).then(function (datedUsers) {
    res.send(datedUsers);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getProjects = function (req, res) {
  var userId = req.body.userId;
  var query = 'SELECT p.content as project_name, p.id as project_id'
  //Sum count number of completed tasks
  + ', SUM(CASE WHEN t.completed_on IS NOT NULL THEN 1 ELSE 0 END) as num_tasks_completed'
  //Sum count number of incomple tasks
  + ', SUM(CASE WHEN t.completed_on IS NULL THEN'
  //Since its LEFT JOIN, null values also appear, so check for them and not count
  + ' CASE WHEN t.id IS NULL THEN 0 ELSE 1 END' + ' ELSE 0 END) as num_tasks_incomplete' + ' FROM projects p' + ' INNER JOIN user_projects up ON up.project_id = p.id' + ' AND up.project_id = p.id' + ' AND up.user_id = \'' + userId + '\'' + ' LEFT JOIN tasks t ON t.project_id = p.id AND t.assignee_id = \'' + userId + '\'' + ' GROUP BY p.id' + ';';

  sequelize.query(query, selectClause).then(function (result) {
    res.send(result);
  })['catch'](function (err) {
    res.status(400).send('Error ' + err);
  });
};