const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getUserMessagesCount = function(req, res) {
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
