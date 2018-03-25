const sequelize = require('./sequelizeHandler').sequelize;
const selectClause = require('./sequelizeHandler').selectClause;
console.log('Tasks Controller Initialized');

exports.getMessagesCount = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const query = 'SELECT COUNT(*) as count FROM messages'
    + ' WHERE DATE(created_at) BETWEEN \'' + startDate
    + '\' AND \'' + endDate + '\''
    + ';';
  sequelize.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}
