const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getUserProjectsCount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT COUNT(*) AS count
FROM user_projects up
WHERE up.user_id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserProjects = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT up.project_id AS projectId, p.content AS name
FROM user_projects up
JOIN projects p ON up.project_id = p.id
WHERE up.user_id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
