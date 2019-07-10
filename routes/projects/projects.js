const fetch = require("node-fetch");
const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;
console.log("Projects Controller Initialized");

exports.getLatestProjects = function(req, res) {
  let maxProjects = req.body.maxProjects;
  if (!maxProjects) maxProjects = 10;

  const query =
    "SELECT p.content, p.github_repo_name, p.created_at, GROUP_CONCAT(display_name) as members, p.id as project_id " +
    " FROM projects p" +
    " JOIN user_projects up ON up.project_id = p.id" +
    " JOIN users u ON up.user_id = u.id" +
    " GROUP BY p.id" +
    " ORDER BY DATE(p.created_at) DESC LIMIT " +
    maxProjects +
    ";";

  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectName = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT p.content AS name
FROM projects p
WHERE p.id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectMembers = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT up.user_id AS userId
FROM user_projects up
WHERE up.project_id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
