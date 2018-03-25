const sequelize = require('./sequelizeHandler').sequelize;
const selectClause = require('./sequelizeHandler').selectClause;
console.log('Tasks Controller Initialized');

exports.getTasksCount = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query = 'SELECT COUNT(*) as count FROM tasks'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';
  sequelize.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getTasksPending = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query = 'SELECT COUNT(*) as count FROM tasks'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ' AND completed_on IS NULL'
    + ';';
  sequelize.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getTasksCompleted = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query = 'SELECT COUNT(*) as count FROM tasks'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ' AND completed_on IS NOT NULL'
    + ';';
  sequelize.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getCompleteTimeData = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const dummyData = {
    data: [
      { task_name:'task1', task_id:'1', 'time_taken': 145876  },
      { task_name:'task1', task_id:'1', 'time_taken': 95876  },
      { task_name:'task2', task_id:'2', 'time_taken': 245876  },
      { task_name:'task2', task_id:'2', 'time_taken': 345876  },
      { task_name:'task3', task_id:'3', 'time_taken': 215876  }
    ]
  }
  res.send(dummyData);
}

exports.getFeatureUtilization = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const queryTasks = 'SELECT COUNT(*) as count FROM tasks'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';
  const queryProjects = 'SELECT COUNT(*) as count FROM projects'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';
  sequelize.query(queryTasks, selectClause).then((resTasks) => {
    sequelize.query(queryProjects, selectClause).then((resProjects) => {
      const countTasks = resTasks[0].count;
      const countProjects = resProjects[0].count;
      let ratio = countTasks / countProjects;
      if (countTasks === 0 || countProjects === 0) {
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
