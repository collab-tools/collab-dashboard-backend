const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getUserProjectsTasks = function(req, res) {
  const id = req.params.id;
  const projectId = req.query.project;
  let query = `
SELECT t.content AS task, t.completed_on AS completeDay, m.deadline AS deadline
FROM tasks t
JOIN milestones m ON m.id = t.milestone_id
WHERE t.assignee_id = '${id}'`.trim();
  if (projectId) query += `AND t.project_id = '${projectId}'`;
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserTasksCount = function(req, res) {
  const id = req.params.id;
  const projectId = req.query.project;
  const complete = req.query.complete;
  let query = `
SELECT COUNT(t.id) AS count
FROM tasks t
WHERE t.assignee_id = '${id}'`.trim();
  if (projectId) query += ` AND t.project_id = '${projectId}'`;
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

exports.getUserTasksContributions = function(req, res) {
  const id = req.params.id;
  let query = `
SELECT p.content AS project, COUNT(t.completed_on) AS completed, COUNT(*) - COUNT(t.completed_on) AS incomplete
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
WHERE t.assignee_id = '${id}'
GROUP BY project`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
