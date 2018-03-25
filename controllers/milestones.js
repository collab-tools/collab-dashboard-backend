const sequelize = require('./sequelizeHandler').sequelize;
const selectClause = require('./sequelizeHandler').selectClause;
console.log('Milestones Controller Initialized');

exports.getMilestonesCount = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const query = 'SELECT COUNT(*) as count FROM milestones'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';
  sequelize.query(query, selectClause)
  .then((result) => {
    const count = result[0].count;
    res.send({
  	  count: count
    });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getCompletedMilestonesCount = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const query =
  // 'SELECT COUNT(*) FROM milestones'
  // 'SELECT COUNT(*) as count FROM milestones m WHERE m.id IN '
  // + ' (SELECT m2.id FROM milestones m2 INNER JOIN tasks t ON m2.id = t.milestone_id AND t.completed_on IS NULL GROUP BY m2.id)'

  'SELECT (COUNT (m.id) - '
  + ' (SELECT COUNT(DISTINCT(m2.id)) FROM milestones m2 INNER JOIN tasks t ON m2.id = t.milestone_id AND t.completed_on IS NULL)'
  + ') AS count '
  + ' FROM milestones m '
  + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate
  + '\' AND \'' + endDate + '\''
  + ';';

  // + ' GROUP BY m.id';
  // ' (SELECT m2.*, t.* FROM milestones m2, tasks t'
  // + ' WHERE m2.id = t.milestone_id '
  // + ' AND t.completed_on IS  NULL GROUP BY m2.id)'

  // 'SELECT m.*'
  // + ' FROM milestones m '
  // + ' WHERE EXISTS '
  // + ' (SELECT NULL FROM milestones m2 INNER JOIN tasks t ON m2.id = t.milestone_id AND t.completed_on IS NULL)'
  // + ' (SELECT m2.id FROM milestones m2, tasks t'
  // + ' WHERE m2.id = t.milestone_id '
  // + ' AND t.completed_on IS NOT NULL GROUP BY m2.id)'

  // + ' AND DATE(m.created_at) BETWEEN \'' + startDate
  // + '\' AND \'' + endDate + '\''
  // + ';';
  sequelize.query(query, selectClause)
  .then((result) => {
    console.log(JSON.stringify(result))
    const count = result[0].count;
    res.send({
  	  count: count
    });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getAverageMilestonesPerProject = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const queryMilestones = 'SELECT COUNT(*) as count '
  + ' FROM milestones m '
  + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate
  + '\' AND \'' + endDate + '\''
  + ';';
  const queryProjects = 'SELECT COUNT(*) as count '
  + ' FROM projects p '
  + ' WHERE DATE(p.created_at) BETWEEN \'' + startDate
  + '\' AND \'' + endDate + '\''
  + ';';
  sequelize.query(queryMilestones, selectClause)
  .then((resultMilestones) => {

    sequelize.query(queryProjects, selectClause)
    .then((resultProjects) => {

      const countMilestones = resultMilestones[0].count;
      const countProjects = resultProjects[0].count;
      let milestonesPerProject = countMilestones / countProjects;
      if (countMilestones === 0 || countProjects === 0) {
        milestonesPerProject = 0;
      }
      res.send({
    	  result: milestonesPerProject
      });

    })

  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getAverageTasksPerMilestone = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const queryMilestones = 'SELECT COUNT(*) as count '
  + ' FROM milestones m '
  + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate
  + '\' AND \'' + endDate + '\''
  + ';';
  const queryTasks = 'SELECT COUNT(*) as count '
  + ' FROM tasks t '
  + ' WHERE DATE(t.created_at) BETWEEN \'' + startDate
  + '\' AND \'' + endDate + '\''
  + ';';
  sequelize.query(queryMilestones, selectClause)
  .then((resultMilestones) => {

    sequelize.query(queryTasks, selectClause)
    .then((resultTasks) => {

      const countMilestones = resultMilestones[0].count;
      const countTasks = resultTasks[0].count;
      let tasksPerMilestone = countTasks / countMilestones;
      if (countMilestones === 0 || countTasks === 0) {
        tasksPerMilestone = 0;
      }
      res.send({
    	  result: tasksPerMilestone
      });

    })

  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getTimeTakenData = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const dummyData = {
    data: [
      { milestoneName:'test1', time_taken:'259200' },
      { milestoneName:'test1', time_taken:'172800' },
      { milestoneName:'test2', time_taken:'195745' },
      { milestoneName:'test3', time_taken:'225856' },
    ]
  }
  res.send(dummyData);
}

exports.getRatioDeadlinesMissed = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const queryTotalMilestones = 'SELECT COUNT(*) as count FROM milestones'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';

  const queryMissedDeadlines = 'SELECT COUNT(*) as count '
    + ' FROM milestones m '
    + ' WHERE EXISTS '
    + '('
    + ' SELECT NULL FROM milestones m2, tasks t'
    + ' WHERE m2.id = t.milestone_id '
    + ' AND (t.completed_on IS NULL OR t.completed_on > m2.deadline)'
    + ')'
    + ' AND DATE(m.created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';

    sequelize.query(queryMissedDeadlines, selectClause)
    .then((resultMissedDeadlines) => {
        sequelize.query(queryTotalMilestones, selectClause)
        .then((resultTotalMilestones) => {
          const countMissedDeadlines = resultMissedDeadlines[0].count;
          const countTotalMilestones = resultTotalMilestones[0].count;
          let ratio = countMissedDeadlines / countTotalMilestones;
          if (countMissedDeadlines === 0 || countTotalMilestones === 0) {
            ratio = 0;
          }
          res.send({
            result: ratio
          })
        })
    })
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
}

exports.getFeatureUtilization = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const queryTotalProjects =
    'SELECT COUNT(*) as count from projects p'
    + ' WHERE DATE(p.created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';

  const queryMilestones =
    'SELECT COUNT(*) as count from milestones m'
    + ' WHERE DATE(m.created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ' GROUP BY m.project_id'
    + ';';

    sequelize.query(queryTotalProjects, selectClause)
    .then((resultTotalProjects) => {

        sequelize.query(queryMilestones, selectClause)
        .then((resultMilestones) => {
          const countMilestones = resultMilestones.length;
          const countTotalProjects = resultTotalProjects[0].count;
          let featureRatio = countMilestones / countTotalProjects;
          if (countMilestones === 0 || countTotalProjects === 0) {
            featureRatio = 0;
          }
          res.send({
            result: featureRatio
          })
        })

    })
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
}
