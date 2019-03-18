console.log("Collab Dashboard Backend Starting V0.1");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const adminController = require("./routes/admin");
const authController = require("./routes/auth");
const usersController = require("./routes/users");
const projectsController = require("./routes/projects");
const milestonesController = require("./routes/milestones");
const tasksController = require("./routes/tasks");

const passport = authController.passport;

var app = express();
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json()); // handle json data
app.use(bodyParser.urlencoded({ extended: true })); // handle URL-encoded data

//Passport middleware
app.use(require("serve-static")(__dirname + "/../../public"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// // use it before all route definitions
app.use(cors({ origin: "http://localhost:3000" }));

// TODO: refactor to this routing pattern, previously was too hard coded
require("./routes")(app, express);

app.get("/", function(req, res) {
  res.send("Dashboard Backend Root");
});

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
app.route("/api/users/count").post(usersController.getUsersCount);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app
  .route("/api/users/num-created-between-dates")
  .post(usersController.getNumUsersCreatedBetweenDates);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app
  .route("/api/users/num-updated-between-dates")
  .post(usersController.getNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app
  .route("/api/users/num-not-updated-between-dates")
  .post(usersController.getTotalMinusNumUsersUpdatedBetweenDates);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app
  .route("/api/users/retention-rate")
  .post(usersController.getUsersRetentionRate);

/*  PARAMS
  maxUsers: INTEGER */
app.route("/api/users/latest").post(usersController.getLatestUsers);

/*  PARAMS
  userId: STRING */
app.route("/api/users/projects").post(usersController.getProjects);

/*****************************
  Milestone Routes
********************************/
app
  .route("/api/milestones/count")
  .post(milestonesController.getMilestonesCount);

app
  .route("/api/milestones/completed-count")
  .post(milestonesController.getCompletedMilestonesCount);

app
  .route("/api/milestones/average-milestones-per-project")
  .post(milestonesController.getAverageMilestonesPerProject);

app
  .route("/api/milestones/average-tasks-per-milestone")
  .post(milestonesController.getAverageTasksPerMilestone);

app
  .route("/api/milestones/time-taken-data")
  .post(milestonesController.getTimeTakenData);

app
  .route("/api/milestones/ratio-deadlines-missed")
  .post(milestonesController.getRatioDeadlinesMissed);

app
  .route("/api/milestones/feature-utilization")
  .post(milestonesController.getFeatureUtilization);

/******************************
  Projects Routes
********************************/
app.route("/api/projects/count").post(projectsController.getProjectsCount);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app
  .route("/api/projects/num-created-between-dates")
  .post(projectsController.getNumProjectsCreatedBetweenDates);

/*  PARAMS
  maxProjects: INTEGER */
app.route("/api/projects/latest").post(projectsController.getLatestProjects);

/*  PARAMS
  startDate: YYYY/MM/DD (e.g 2017/09/03)
  endDate: YYYY/MM/DD (e.g 2017/09/03)  */
app
  .route("/api/projects/active-rate-between-dates")
  .post(projectsController.getProjectsActiveRateBetweenDates);

/*  PARAMS
  projectId: STRING  */
app.route("/api/projects/milestones").post(projectsController.getMilestones);

/******************************
  Tasks Routes
********************************/
app.route("/api/tasks/count").post(tasksController.getTasksCount);

app.route("/api/tasks/count-pending").post(tasksController.getTasksPending);

app.route("/api/tasks/count-completed").post(tasksController.getTasksCompleted);

app
  .route("/api/tasks/complete-time-data")
  .post(tasksController.getCompleteTimeData);

app
  .route("/api/tasks/feature-utilization")
  .post(tasksController.getFeatureUtilization);

app.listen(5000);
