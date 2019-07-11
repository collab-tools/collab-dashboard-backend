const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getUserFileChanges = function(req, res) {
  const id = req.params.id;
  const projectNameQuery = `
SELECT p.content AS name, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();
  const emailQuery = `
SELECT u.email AS email
FROM users u
WHERE u.id = '${id}'`.trim();
  Promise.all([
    sequelize.app.query(projectNameQuery, selectClause),
    sequelize.app.query(emailQuery, selectClause)
  ])
    .then(([projects, email]) => {
      let projObj = {};
      projects.forEach(proj => {
        projObj[proj.projectId] = proj.name;
      });
      const query = `
SELECT f.project_id AS project, f.file_name AS fileName, f.date AS timestamp
FROM file_logs f
WHERE f.email = '${email[0].email}'
AND f.activity = 'U'
ORDER BY timestamp DESC`.trim();
      sequelize.log.query(query, selectClause).then(changes => {
        changes.forEach(change => (change.project = projObj[change.project]));
        res.send(changes);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserFileChangesCount = function(req, res) {
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

exports.getUserFilesCount = function(req, res) {
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
AND f.activity = 'C'`.trim();
      if (projectId) query += ` AND f.project_id = '${projectId}'`;
      sequelize.log.query(query, selectClause).then(result2 => {
        res.send(result2[0]);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserFilesContributions = function(req, res) {
  const id = req.params.id;
  const projectNameQuery = `
SELECT p.content AS name, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();
  const emailQuery = `
SELECT u.email AS email
FROM users u
WHERE u.id = '${id}'`.trim();
  Promise.all([
    sequelize.app.query(projectNameQuery, selectClause),
    sequelize.app.query(emailQuery, selectClause)
  ])
    .then(([projects, email]) => {
      let projObj = {};
      projects.forEach(proj => {
        projObj[proj.projectId] = proj.name;
      });
      const query = `
SELECT f.project_id AS project, COUNT(f.id) AS changes
FROM file_logs f
WHERE f.email = '${email[0].email}'
AND f.activity = 'U'
GROUP BY project`.trim();
      sequelize.log.query(query, selectClause).then(changes => {
        changes.forEach(change => (change.project = projObj[change.project]));
        res.send(changes);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
