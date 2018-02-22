console.log('Collab Dashboard Backend Starting V0.1');

var express = require('express');
var cors = require('cors');

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

// sequelize.query("SHOW TABLES;")
//   .then(users => {
//     console.log(JSON.stringify(users));
//   });

var app = express();
// use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.get('/projects-count', function (req, res) {
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

app.listen(3001)
