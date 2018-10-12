// Packages & Dependencies
// ====================================================
const bodyParser = require('body-parser');
const boom = require("boom");
const compression = require('compression');
const config = require('config');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const validator = require('express-validator');
const winston = require('winston');
const winstonRotate = require('winston-daily-rotate-file');
// Init App
// =====================================================
const app = express();
const isProduction = app.get('env') === 'production';
const rootApp = isProduction ? `${__dirname}/dist` : `${__dirname}/app`;
const rootPublic = `${__dirname}/assets/static`;
const rootLogging = `${__dirname}/logs`;

// eslint-disable-next-line import/no-dynamic-require
require(`${rootApp}/common/mixins`)();

app.use(bodyParser.urlencoded({ extended: true })); // handle URL-encoded data
app.use(bodyParser.json()); // handle json data

//Passport middleware
// const passport = authController.passport;
// app.use(passport.initialize());
// app.use(passport.session());

// use it before all route definitions
// configure app to handle CORS requests
app.use(cors());
// log all API requests to console
app.use(morgan('dev'));
// compress all endpoint routes
app.use(compression());
// enable validator middle-ware for endpoints
app.use(validator());
// further secure by modifying various http headers
app.use(helmet());
// middleware to protect against HTTP parameter pollution attacks
app.use(hpp());

app.use(express.static(rootPublic));


// API Routes
// =====================================================
// eslint-disable-next-line import/no-dynamic-require
require(`${rootApp}/routes`)(app, express);
app.all('*', (req, res) => {
  res.sendFile(`${rootPublic}/index.html`);
});

// TODO: Routes needs to be replaced
// ====================================================
// const authController = require('./routes/auth');
// const usersController = require('./routes/users');
// const projectsController = require('./routes/projects');
// const milestonesController = require('./routes/milestones');
// const tasksController = require('./routes/tasks');

// configure logger to use as default error handler
const tsFormat = () => (new Date()).toLocaleTimeString();
if (!fs.existsSync(rootLogging)) { fs.mkdirSync(rootLogging); }
winston.remove(winston.transports.Console);

// default transport for console with timestamp and color coding
winston.add(winston.transports.Console, {
  prettyPrint: true,
  timestamp: tsFormat,
  colorize: true,
  level: 'debug'
});

// file transport for debug messages
winston.add(winstonRotate, {
  name: 'debug-transport',
  filename: `${rootLogging}/debug.log`,
  timestamp: tsFormat,
  level: 'debug'
});

// file transport for system messages
winston.add(winstonRotate, {
  name: 'system-transport',
  filename: `${rootLogging}/system.log`,
  timestamp: tsFormat,
  level: 'info'
});

winston.info('Debugging tool initialized.');

// configure express error handler middleware
const ERROR_BAD_REQUEST = 'Unable to serve your content. Check your arguments.';
const logErrors = (err, req, res, next) => {
  if (err.isBoom) {
    winston.debug(`Status Code: ${err.output.statusCode} | ${err.stack}`, err.data);
    next(err);
  } else {
    winston.error(err);
    next(boom.badRequest(ERROR_BAD_REQUEST));
  }
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  res.status(err.output.statusCode).json(err.output.payload);
};

app.use(logErrors);
app.use(errorHandler);

/******************************
  Auth Routes
********************************/
// app.route('/login')
//     .post(authController.localAuthenticated, authController.login);

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
// app.route('/api/users/count')
//     .post(authController.jwtAuthenticated, usersController.getUsersCount);


// /*  PARAMS
//   startDate: YYYY/MM/DD (e.g 2017/09/03)
//   endDate: YYYY/MM/DD (e.g 2017/09/03)  */
// app.route('/api/users/num-created-between-dates')
//     .post(usersController.getNumUsersCreatedBetweenDates);

// /*  PARAMS
//   startDate: YYYY/MM/DD (e.g 2017/09/03)
//   endDate: YYYY/MM/DD (e.g 2017/09/03)  */
// app.route('/api/users/num-updated-between-dates')
//     .post(usersController.getNumUsersUpdatedBetweenDates);

// /*  PARAMS
//   startDate: YYYY/MM/DD (e.g 2017/09/03)
//   endDate: YYYY/MM/DD (e.g 2017/09/03)  */
// app.route('/api/users/num-not-updated-between-dates')
//     .post(usersController.getTotalMinusNumUsersUpdatedBetweenDates);

// /*  PARAMS
//   startDate: YYYY/MM/DD (e.g 2017/09/03)
//   endDate: YYYY/MM/DD (e.g 2017/09/03)  */
// app.route('/api/users/retention-rate')
//     .post(usersController.getUsersRetentionRate);

// /*  PARAMS
//   maxUsers: INTEGER */
// app.route('/api/users/latest')
//     .post(usersController.getLatestUsers);

// /*  PARAMS
//   userId: STRING */
// app.route('/api/users/projects')
//     .post(usersController.getProjects);

// /*****************************
//   Milestone Routes
// ********************************/
// app.route('/api/milestones/count')
//     .post(milestonesController.getMilestonesCount);

// app.route('/api/milestones/completed-count')
//     .post(milestonesController.getCompletedMilestonesCount);

// app.route('/api/milestones/average-milestones-per-project')
//     .post(milestonesController.getAverageMilestonesPerProject);

// app.route('/api/milestones/average-tasks-per-milestone')
//     .post(milestonesController.getAverageTasksPerMilestone);

// app.route('/api/milestones/time-taken-data')
//     .post(milestonesController.getTimeTakenData);

// app.route('/api/milestones/ratio-deadlines-missed')
//     .post(milestonesController.getRatioDeadlinesMissed);

// app.route('/api/milestones/feature-utilization')
//     .post(milestonesController.getFeatureUtilization);

// /******************************
//   Projects Routes
// ********************************/
// app.route('/api/projects/count')
//     .post(projectsController.getProjectsCount);

// /*  PARAMS
//   startDate: YYYY/MM/DD (e.g 2017/09/03)
//   endDate: YYYY/MM/DD (e.g 2017/09/03)  */
// app.route('/api/projects/num-created-between-dates')
//     .post(projectsController.getNumProjectsCreatedBetweenDates);

// /*  PARAMS
//   maxProjects: INTEGER */
// app.route('/api/projects/latest')
//     .post(projectsController.getLatestProjects);

// /*  PARAMS
//   startDate: YYYY/MM/DD (e.g 2017/09/03)
//   endDate: YYYY/MM/DD (e.g 2017/09/03)  */
// app.route('/api/projects/active-rate-between-dates')
//     .post(projectsController.getProjectsActiveRateBetweenDates);

// /*  PARAMS
//   projectId: STRING  */
// app.route('/api/projects/milestones')
//     .post(projectsController.getMilestones);

// /******************************
//   Tasks Routes
// ********************************/
// app.route('/api/tasks/count')
//     .post(tasksController.getTasksCount);

// app.route('/api/tasks/count-pending')
//     .post(tasksController.getTasksPending);

// app.route('/api/tasks/count-completed')
//     .post(tasksController.getTasksCompleted);

// app.route('/api/tasks/complete-time-data')
//     .post(tasksController.getCompleteTimeData);

// app.route('/api/tasks/feature-utilization')
//     .post(tasksController.getFeatureUtilization);

app.listen(config.get('port'));
