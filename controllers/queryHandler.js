console.log('QueryHandler Initialized');

const Sequelize = require('sequelize');
const selectClause =   {type: Sequelize.QueryTypes.SELECT};
const sequelize = new Sequelize('collab', 'root', '12341234', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database.');
  });


exports.getUsersCount = function (req, res) {
  const query = 'SELECT COUNT(*) as count FROM users;';
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

exports.getNumUsersCreatedBetweenDates = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE created_at between \'' + startDate + '\' AND \'' + endDate + '\''
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
  + 'WHERE updated_at between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getLatestUsers = function (req, res) {
  let maxUsers = req.body.maxUsers;
  if (!maxUsers) maxUsers = 10;

  const datedUsersQuery =
  'SELECT u.display_name, u.email, u.github_login, u.created_at, GROUP_CONCAT(content) as user_projects '
  + ' FROM users u'
  + ' JOIN user_projects up ON up.user_id = u.id'
  + ' JOIN projects p ON up.project_id = p.id'
  + ' GROUP BY u.id'
  + ' ORDER BY u.created_at DESC LIMIT ' + maxUsers
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((datedUsers) => {
      res.send(datedUsers);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};



// Project Related

exports.getProjectsCount = function (req, res) {
  const query = 'SELECT COUNT(*) as count FROM projects;';
  sequelize.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getLatestProjects = function (req, res) {
  let maxProjects = req.body.maxProjects;
  if (!maxProjects) maxProjects = 10;

  const query =
  'SELECT p.content, p.github_repo_name, p.created_at, GROUP_CONCAT(display_name) as members '
  + ' FROM projects p'
  + ' JOIN user_projects up ON up.project_id = p.id'
  + ' JOIN users u ON up.user_id = u.id'
  + ' GROUP BY p.id'
  + ' ORDER BY p.created_at DESC LIMIT ' + maxProjects
  + ';';

  sequelize.query(query, selectClause)
    .then((result) => {
      res.send(result);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};
