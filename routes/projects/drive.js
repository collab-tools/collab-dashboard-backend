const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getProjectDriveLink = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT p.root_folder AS link
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

exports.getProjectFilesChanges = function(req, res) {
  const id = req.params.id;
  const emailQuery = `
SELECT u.display_name AS name, u.email AS email
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  sequelize.app
    .query(emailQuery, selectClause)
    .then(members => {
      let emailObj = {};
      members.forEach(member => {
        emailObj[member.email] = member.name;
      });
      return emailObj;
    })
    .then(emailObj => {
      const query = `
SELECT f.email AS author, f.file_name AS fileName, f.date AS timestamp
FROM file_logs f
WHERE f.project_id = '${id}'
AND f.activity = 'U'
ORDER BY timestamp DESC`.trim();
      sequelize.log.query(query, selectClause).then(changes => {
        changes.forEach(change => (change.author = emailObj[change.author] || change.author));
        res.send(changes);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectFilesCount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT COUNT(f.id) AS count
FROM file_logs f
WHERE f.project_id = '${id}'
AND f.activity = 'C'`.trim();
  sequelize.log
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectFileChangesCount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT COUNT(f.id) AS count
FROM file_logs f
WHERE f.project_id = '${id}'
AND f.activity = 'U'`.trim();
  sequelize.log
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectFilesContributions = function(req, res) {
  const id = req.params.id;
  const emailQuery = `
SELECT u.display_name AS name, u.email AS email
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  sequelize.app
    .query(emailQuery, selectClause)
    .then(members => {
      let emailObj = {};
      members.forEach(member => {
        emailObj[member.email] = member.name;
      });
      return emailObj;
    })
    .then(emailObj => {
      const query = `
SELECT COUNT(f.id) AS changes, f.email AS member
FROM file_logs f
WHERE f.project_id = '${id}'
GROUP BY member`.trim();
      sequelize.log.query(query, selectClause).then(contrs => {
        contrs.forEach(contr => (contr.member = emailObj[contr.member] || contr.member));
        res.send(contrs);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
