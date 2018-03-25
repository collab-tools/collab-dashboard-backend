const sequelize = require('./sequelizeHandler').sequelize;
const selectClause = require('./sequelizeHandler').selectClause;
console.log('Users Controller Initialized');

exports.getUsersCount = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const query = 'SELECT COUNT(*) as count FROM users'
  + ' WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';
  sequelize.query(query, selectClause)
  .then((result) => {
    console.log('result = ' + JSON.stringify(selectClause));
    const count = result[0].count;
    res.send({
  	  count: count
    });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getNumUsersCreatedBetweenDates = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getNumUsersUpdatedBetweenDates = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getTotalMinusNumUsersUpdatedBetweenDates = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE NOT DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getUsersRetentionRate = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const totalUsersQuery = 'SELECT COUNT (*) as count FROM users';
  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(totalUsersQuery, selectClause)
    .then((total) => {
      sequelize.query(datedUsersQuery, selectClause)
        .then((active) => {
          const totalCount = total[0].count;
          const numActive = active[0].count;
          const rate = (numActive/totalCount);
          res.send({
            rate: rate
          });
        })
      }
    )
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
};

exports.getLatestUsers = function (req, res) {
  let maxUsers = req.body.maxUsers;
  if (!maxUsers) maxUsers = 10;

  const datedUsersQuery =
  'SELECT u.display_name, u.email, u.github_login, u.created_at, GROUP_CONCAT(content) as user_projects, u.id as user_id '
  + ' FROM users u'
  + ' JOIN user_projects up ON up.user_id = u.id'
  + ' JOIN projects p ON up.project_id = p.id'
  + ' GROUP BY u.id'
  + ' ORDER BY DATE(u.created_at) DESC LIMIT ' + maxUsers
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((datedUsers) => {
      res.send(datedUsers);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getProjects = function (req, res) {
  const userId = req.body.userId;
  const query = 'SELECT p.content as project_name, p.id as project_id'
  + ', SUM(CASE WHEN t.completed_on IS NOT NULL THEN 1 ELSE 0 END) as num_tasks_completed'
  + ', SUM(CASE WHEN t.completed_on IS NULL THEN 1 ELSE 0 END) as num_tasks_incomplete'
  + ' FROM projects p, tasks t'
  + ' WHERE p.id = t.project_id'
  + ' GROUP BY p.id'
  + ';';

  sequelize.query(query, selectClause)
    .then((result) => {
      res.send(result);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};
