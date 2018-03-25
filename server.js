console.log('Collab Dashboard Backend Starting V0.1');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const authController = require('./controllers/auth');
const usersController = require('./controllers/users');
const projectsController = require('./controllers/projects');
const milestonesController = require('./controllers/milestones');
const tasksController = require('./controllers/tasks');

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
    .post(authController.jwtAuthenticated, usersController.getUsersCount);


/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app.route('/users/num-created-between-dates')
    .post(usersController.getNumUsersCreatedBetweenDates);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app.route('/users/num-updated-between-dates')
    .post(usersController.getNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app.route('/users/num-not-updated-between-dates')
    .post(usersController.getTotalMinusNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app.route('/users/retention-rate')
    .post(usersController.getUsersRetentionRate);

/*  PARAMS
  maxUsers: INTEGER */
app.route('/users/latest')
    .post(usersController.getLatestUsers);

/*  PARAMS
  userId: STRING */
app.route('/users/projects')
    .post(usersController.getProjects);

/*****************************
  Milestone Routes
********************************/
app.route('/milestones/count')
    .post(milestonesController.getMilestonesCount);

app.route('/milestones/completed-count')
    .post(milestonesController.getCompletedMilestonesCount);

app.route('/milestones/average-milestones-per-project')
    .post(milestonesController.getAverageMilestonesPerProject);

app.route('/milestones/average-tasks-per-milestone')
    .post(milestonesController.getAverageTasksPerMilestone);

app.route('/milestones/time-taken-data')
    .post(milestonesController.getTimeTakenData);

app.route('/milestones/ratio-deadlines-missed')
    .post(milestonesController.getRatioDeadlinesMissed);

app.route('/milestones/feature-utilization')
    .post(milestonesController.getFeatureUtilization);

/******************************
  Projects Routes
********************************/
app.route('/projects/count')
    .post(projectsController.getProjectsCount);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app.route('/projects/num-created-between-dates')
    .post(projectsController.getNumProjectsCreatedBetweenDates);

/*  PARAMS
  maxProjects: INTEGER */
app.route('/projects/latest')
    .post(projectsController.getLatestProjects);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app.route('/projects/active-rate-between-dates')
    .post(projectsController.getProjectsActiveRateBetweenDates);

/*  PARAMS
  projectId: STRING  */
app.route('/projects/milestones')
    .post(projectsController.getMilestones);

/******************************
  Tasks Routes
********************************/
app.route('/tasks/count')
    .post(tasksController.getTasksCount);

app.route('/tasks/count-pending')
    .post(tasksController.getTasksPending);

app.route('/tasks/count-completed')
    .post(tasksController.getTasksCompleted);

app.route('/tasks/complete-time-data')
    .post(tasksController.getCompleteTimeData);

app.route('/tasks/feature-utilization')
    .post(tasksController.getFeatureUtilization);

app.listen(3001)
