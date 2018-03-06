const sequelize = require('./sequelizeHandler').sequelize;
const selectClause = require('./sequelizeHandler').selectClause;
console.log('Milestones Controller Initialized');

exports.getMilestonesCount = function (req, res) {
  const query = 'SELECT COUNT(*) as count FROM milestones;';
  sequelize.query(query, selectClause)
  .then((result) => {
    const count = result[0].count;
    res.send({
  	  count: count
    });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}
