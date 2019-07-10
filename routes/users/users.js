const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;
console.log("Users Controller Initialized");

exports.getLatestUsers = function(req, res) {
  let maxUsers = req.body.maxUsers;
  if (!maxUsers) maxUsers = 10;

  const datedUsersQuery =
    "SELECT u.display_name, u.email, u.github_login, u.created_at, GROUP_CONCAT(content) as user_projects, u.id as user_id " +
    " FROM users u" +
    " JOIN user_projects up ON up.user_id = u.id" +
    " JOIN projects p ON up.project_id = p.id" +
    " GROUP BY u.id" +
    " ORDER BY DATE(u.created_at) DESC LIMIT " +
    maxUsers +
    ";";

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

exports.getTasksCount = function(req, res) {
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

exports.getMessagesCount = function(req, res) {
  const id = req.params.id;
  const projectId = req.query.project;
  let query = `
SELECT COUNT(m.id) AS count
FROM messages m
WHERE m.author_id = '${id}'`.trim();
  if (projectId) query += ` AND m.project_id = '${projectId}'`;
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getCommitsCount = function(req, res) {
  const id = req.params.id;
  const projectId = req.query.project;
  const githubQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();

  sequelize.app
    .query(githubQuery, selectClause)
    .then(result1 => result1[0].account)
    .then(acc => {
      let query = `
SELECT COUNT(c.id) AS count
FROM commit_logs c
WHERE c.github_login = '${acc}'`.trim();
      if (projectId) query += ` AND c.project_id = '${projectId}'`;
      sequelize.log.query(query, selectClause).then(result2 => {
        res.send(result2[0]);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getFileChangesCount = function(req, res) {
  const id = req.params.id;
  const projectId = req.query.project;
  const emailQuery = `
SELECT u.email AS email
FROM users u
WHERE u.id = '${id}'`.trim();
  sequelize.app
    .query(emailQuery, selectClause)
    .then(result1 => result1[0].email)
    .then(email => {
      let query = `
SELECT COUNT(f.id) AS count
FROM file_logs f
WHERE f.email = '${email}'
AND f.activity = 'U'`.trim();
      if (projectId) query += ` AND f.project_id = '${projectId}'`;
      sequelize.log.query(query, selectClause).then(result2 => {
        res.send(result2[0]);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
