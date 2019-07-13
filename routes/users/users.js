const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;
console.log("Users Controller Initialized");

exports.getLatestUsers = function(req, res) {
  const datedUsersQuery =
    "SELECT u.display_name, u.email, u.github_login, u.created_at, GROUP_CONCAT(content) as user_projects, u.id as user_id " +
    " FROM users u" +
    " JOIN user_projects up ON up.user_id = u.id" +
    " JOIN projects p ON up.project_id = p.id" +
    " GROUP BY u.id" +
    " ORDER BY DATE(u.created_at) DESC";

  sequelize.app
    .query(datedUsersQuery, selectClause)
    .then(datedUsers => {
      res.send(datedUsers);
    })
    .catch(function(err) {
      res.status(400).send("Error " + err);
    });
};

exports.getProjects = function(req, res) {
  const userId = req.body.userId;
  const query =
    "SELECT p.content as project_name, p.id as project_id" +
    //Sum count number of completed tasks
    ", SUM(CASE WHEN t.completed_on IS NOT NULL THEN 1 ELSE 0 END) as num_tasks_completed" +
    //Sum count number of incomple tasks
    ", SUM(CASE WHEN t.completed_on IS NULL THEN" +
    //Since its LEFT JOIN, null values also appear, so check for them and not count
    " CASE WHEN t.id IS NULL THEN 0 ELSE 1 END" +
    " ELSE 0 END) as num_tasks_incomplete" +
    " FROM projects p" +
    " INNER JOIN user_projects up ON up.project_id = p.id" +
    " AND up.project_id = p.id" +
    " AND up.user_id = '" +
    userId +
    "'" +
    " LEFT JOIN tasks t ON t.project_id = p.id AND t.assignee_id = '" +
    userId +
    "'" +
    " GROUP BY p.id" +
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

exports.getUserName = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT u.display_name AS name
FROM users u
WHERE u.id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserEmail = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT u.email AS email
FROM users u
WHERE u.id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserImage = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT u.display_image AS displayImage
FROM users u
WHERE u.id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
