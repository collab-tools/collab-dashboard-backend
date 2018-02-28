console.log('Collab Dashboard Backend Starting V0.1');

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

const Sequelize = require('sequelize');
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

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

// use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));

app.get('/', function (req, res) {
  res.send('Dashboard Backend Root')
})

app.get('/users-count', function (req, res) {
  sequelize.query('SELECT COUNT(*) as count FROM users;').then((result) => {
    const count = result[0][0].count;
    res.send({
  	  count: count
    });
  });
})

app.get('/milestones-count', function (req, res) {
  sequelize.query('SELECT COUNT(*) as count FROM milestones;').then((result) => {
    const count = result[0][0].count;
    res.send({
  	  count: count
    });
  });
})

/*
  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)
  maxUsers INT
*/

const selectClause =   {type: Sequelize.QueryTypes.SELECT};

app.post('/users/num-created-between-dates', function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE created_at between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
    });
});

app.post('/users/num-updated-between-dates', function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE updated_at between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
    });
});

app.post('/users/get-latest', function (req, res) {
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
    });
});

app.listen(3001)
