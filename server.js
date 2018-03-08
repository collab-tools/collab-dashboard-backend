console.log('Collab Dashboard Backend Starting V0.1');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authController = require('./controllers/auth');
const usersController = require('./controllers/users');
const projectsController = require('./controllers/projects');
const milestonesController = require('./controllers/milestones');

const passport = authController.passport;

var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true })) // handle URL-encoded data

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

/******************************
  Auth Routes
********************************/
app.route('/login')
    .post(authController.localAuthenticated, authController.login);

// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile'] }));
//
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     res.redirect('/');
//   });


/******************************
  User Routes
********************************/
app.route('/users/count')
    .get(authController.jwtAuthenticated, usersController.getUsersCount);


/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/num-created-between-dates')
    .post(usersController.getNumUsersCreatedBetweenDates);

/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/num-updated-between-dates')
    .post(usersController.getNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/num-not-updated-between-dates')
    .post(usersController.getTotalMinusNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/users/retention-rate')
    .post(usersController.getUsersRetentionRate);

/*  PARAMS
  maxUsers: INTEGER */
app.route('/users/latest')
    .post(usersController.getLatestUsers);

/*****************************
  Milestone Routes
********************************/
app.route('/milestones/count')
    .get(milestonesController.getMilestonesCount);

app.route('/milestones/completed-count')
    .get(milestonesController.getCompletedMilestonesCount);


/******************************
  Projects Routes
********************************/
app.route('/projects/count')
    .get(projectsController.getProjectsCount);

/*  PARAMS
  maxProjects: INTEGER */
app.route('/projects/latest')
    .post(projectsController.getLatestProjects);

/*  PARAMS
  startDate: YYYY-MM-DD (e.g 2011-09-14)
  endDate: YYYY-MM-DD (e.g 2011-09-14)  */
app.route('/projects/active-rate-between-dates')
    .post(projectsController.getProjectsActiveRateBetweenDates);


app.listen(3001)
