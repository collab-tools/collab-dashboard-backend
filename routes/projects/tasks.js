const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getProjectTasks = function(req, res) {
  const id = req.params.id;
  const milestone = req.query.milestone;
  let query = `
SELECT t.content AS taskName, u.display_name AS assignee, t.completed_on AS completeDay
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
WHERE t.project_id = '${id}'`.trim();
  if (milestone) query += ` AND t.milestone_id='${milestone}'`;
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectTasksCount = function(req, res) {
  const id = req.params.id;
  const complete = req.query.complete;
  let query = `
SELECT COUNT(t.id) AS count
FROM tasks t
WHERE t.project_id = '${id}'`.trim();
  if (complete) query += ` AND t.completed_on IS ${complete === "true" ? "NOT" : ""} NULL`;
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectTasksContributions = function(req, res) {
  const id = req.params.id;
  let query = `
SELECT u.display_name AS member, COUNT(completed_on) AS completed, COUNT(*) - COUNT(completed_on) AS incomplete
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
WHERE t.project_id = '${id}'
GROUP BY member`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
