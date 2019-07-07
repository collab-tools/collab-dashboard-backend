const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;
console.log("Tasks Controller Initialized");

exports.getTasksCount = function(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query =
    "SELECT COUNT(*) as count FROM tasks" +
    " WHERE DATE(created_at) BETWEEN '" +
    startDate +
    "' AND '" +
    endDate +
    "'" +
    ";";
  sequelize
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};

exports.getTasksPending = function(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query =
    "SELECT COUNT(*) as count FROM tasks" +
    " WHERE DATE(created_at) BETWEEN '" +
    startDate +
    "' AND '" +
    endDate +
    "'" +
    " AND completed_on IS NULL" +
    ";";
  sequelize
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};

exports.getTasksCompleted = function(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query =
    "SELECT COUNT(*) as count FROM tasks" +
    " WHERE DATE(created_at) BETWEEN '" +
    startDate +
    "' AND '" +
    endDate +
    "'" +
    " AND completed_on IS NOT NULL" +
    ";";
  sequelize
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};

exports.getCompleteTimeData = function(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const query =
    "SELECT t.content as task_name, t.id as task_id" +
    ", TIMESTAMPDIFF(SECOND, t.created_at, t.completed_on) as time_taken" +
    " FROM tasks t" +
    " WHERE t.completed_on IS NOT NULL" +
    " AND DATE(t.created_at) BETWEEN '" +
    startDate +
    "' AND '" +
    endDate +
    "'" +
    " GROUP BY t.id";

  sequelize
    .query(query, selectClause)
    .then(result => {
      res.send({
        data: result
      });
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};

exports.getFeatureUtilization = function(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const queryTasks =
    "SELECT COUNT(*) as count FROM tasks" +
    " WHERE DATE(created_at) BETWEEN '" +
    startDate +
    "' AND '" +
    endDate +
    "'" +
    " GROUP BY milestone_id" +
    ";";
  const queryMilestones =
    "SELECT COUNT(*) as count FROM milestones" +
    " WHERE DATE(created_at) BETWEEN '" +
    startDate +
    "' AND '" +
    endDate +
    "'" +
    ";";
  sequelize
    .query(queryTasks, selectClause)
    .then(resTasks => {
      sequelize.query(queryMilestones, selectClause).then(resMilestones => {
        const countTasks = resTasks.length;
        const countMilestones = resMilestones[0].count;
        let ratio = countTasks / countMilestones;
        if (countTasks === 0 || countMilestones === 0) {
          ratio = 0;
        }
        res.send({
          result: ratio
        });
      });
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};
