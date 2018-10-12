const config = require('config');
const jwt = require('express-jwt');
const tasks = require('./tasks');

module.exports = (express) => {
  const tasksRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  tasksRouter.use(auth);

  // New Dashboard API
  tasksRouter.post('/count', tasks.getTasksCount);
  tasksRouter.post('/count-pending', tasks.getTasksPending);
  tasksRouter.post('/count-completed', tasks.getTasksCompleted);
  tasksRouter.post('/complete-time-data', tasks.getCompleteTimeData);
  tasksRouter.post('/feature-utilization', tasks.getFeatureUtilization);

  return tasksRouter;
};
