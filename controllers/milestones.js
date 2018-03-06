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

exports.getCompletedMilestonesCount = function (req, res) {
  const query = 'SELECT * '
  + ' FROM milestones m '
  + ' WHERE EXISTS '
  + ' (SELECT NULL FROM milestones m2, tasks t'
  + ' WHERE m2.id = t.milestone_id '
  + ' AND t.completed_on IS NOT NULL)'
  + ';';
  sequelize.query(query, selectClause)
  .then((result) => {
    // const count = result[0].count;
    res.send(result);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}
