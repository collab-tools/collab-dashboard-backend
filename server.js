console.log('Collab Dashboard Backend Starting V0.1');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const queryHandler = require('./controllers/queryHandler');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

// // use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));

app.get('/', function (req, res) {
  res.send('Dashboard Backend Root')
})

/******************************
User Routes
*******************************/
app.route('/users/count')
    .get(queryHandler.getUsersCount);


/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/num-created-between-dates')
    .post(queryHandler.getNumUsersCreatedBetweenDates);

/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/num-updated-between-dates')
    .post(queryHandler.getNumUsersUpdatedBetweenDates);

/*  PARAMS
  maxUsers: INTEGER */
app.route('/users/latest')
    .post(queryHandler.getLatestUsers);

/******************************
Milestone Routes
*******************************/
app.route('/milestones/count')
    .get(queryHandler.getMilestonesCount);

/******************************
Projects Routes
*******************************/
app.route('/projects/count')
    .get(queryHandler.getProjectsCount);

/*  PARAMS
  maxProjects: INTEGER */
app.route('/projects/latest')
    .post(queryHandler.getLatestProjects);

app.listen(3001)
