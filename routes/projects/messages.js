const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

exports.getProjectMessagesCount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT COUNT(m.id) AS count
FROM messages m
WHERE m.project_id = '${id}'
AND m.author_id IS NOT NULL`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
