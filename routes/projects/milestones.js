const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getProjectMilestones = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT m.id AS milestoneId, m.content AS name, DATE(m.deadline) AS deadline
FROM milestones m
WHERE m.project_id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectMilestonesCount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT COUNT(m.id) AS count
FROM milestones m
WHERE m.project_id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
