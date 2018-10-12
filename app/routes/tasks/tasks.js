const _ = require('lodash');
const boom = require('boom');
const moment = require('moment');
const Promise = require('bluebird');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');

const models = new Storage();

function getTasksCount(req, res) {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const query = 'SELECT COUNT(*) as count FROM tasks'
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

function getTasksPending(req, res) {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const query = 'SELECT COUNT(*) as count FROM tasks'
      + ' WHERE DATE(created_at) BETWEEN \'' + startDate
      + '\' AND \'' + endDate + '\''
      + ' AND completed_on IS NULL'
      + ';';
    models.app.query(query, selectClause).then((result) => {
      res.send(result[0]);
    })
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
}

function getTasksCompleted(req, res) {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const query = 'SELECT COUNT(*) as count FROM tasks'
      + ' WHERE DATE(created_at) BETWEEN \'' + startDate
      + '\' AND \'' + endDate + '\''
      + ' AND completed_on IS NOT NULL'
      + ';';
    models.app.query(query, selectClause).then((result) => {
      res.send(result[0]);
    })
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
}

function getCompleteTimeData(req, res) {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
  
    const query =
    'SELECT t.content as task_name, t.id as task_id'
    + ', TIMESTAMPDIFF(SECOND, t.created_at, t.completed_on) as time_taken'
    + ' FROM tasks t'
    + ' WHERE t.completed_on IS NOT NULL'
    + ' AND DATE(t.created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ' GROUP BY t.id';
  
    models.app.query(query, selectClause)
    .then((result) => {
      res.send({
        data: result
      });
    })
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
}

function getFeatureUtilization(req, res) {
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const queryTasks = 'SELECT COUNT(*) as count FROM tasks'
      + ' WHERE DATE(created_at) BETWEEN \'' + startDate
      + '\' AND \'' + endDate + '\''
      + ' GROUP BY milestone_id'
      + ';';
    const queryMilestones = 'SELECT COUNT(*) as count FROM milestones'
      + ' WHERE DATE(created_at) BETWEEN \'' + startDate
      + '\' AND \'' + endDate + '\''
      + ';';
    models.app.query(queryTasks, selectClause).then((resTasks) => {
        models.app.query(queryMilestones, selectClause).then((resMilestones) => {
        const countTasks = resTasks.length;
        const countMilestones = resMilestones[0].count;
        let ratio = countTasks / countMilestones;
        if (countTasks === 0 || countMilestones === 0) {
          ratio = 0;
        }
        res.send({
          result: ratio
        });
      })
    })
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
  }

const tasksAPI = {
    getTasksCount,
    getTasksPending,
    getTasksCompleted,
    getCompleteTimeData,
    getFeatureUtilization
};

module.exports = tasksAPI;
