console.log('Collab Dashboard Backend Starting V0.1');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const queryHandler = require('./controllers/queryHandler');
const authController = require('./controllers/auth');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

//Passport middleware
app.use(require('serve-static')(__dirname + '/../../public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// // use it before all route definitions
app.use(cors({origin: 'http://localhost:3000'}));

app.get('/', function (req, res) {
  res.send('Dashboard Backend Root')
})


app.route('/login')
    .post(authController.localAuthenticated, authController.login);

/******************************
User Routes
*******************************/
app.route('/users/count')
    .get(authController.jwtAuthenticated, queryHandler.getUsersCount);


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
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/num-not-updated-between-dates')
    .post(queryHandler.getTotalMinusNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/retention-rate')
    .post(queryHandler.getRetentionRate);

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
