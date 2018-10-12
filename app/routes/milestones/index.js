const config = require('config');
const jwt = require('express-jwt');
const milestones = require('./milestones');

module.exports = (express) => {
  const milestonesRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  milestonesRouter.use(auth);

  // New Dashboard API
  milestonesRouter.post('/count', milestones.getMilestonesCount);
  milestonesRouter.post('/completed-count', milestones.getCompletedMilestonesCount);
  milestonesRouter.post('/average-milestones-per-project', milestones.getAverageMilestonesPerProject);
  milestonesRouter.post('/average-tasks-per-milestone', milestones.getAverageTasksPerMilestone);
  milestonesRouter.post('/time-taken-data', milestones.getTimeTakenData);
  milestonesRouter.post('/ratio-deadlines-missed', milestones.getRatioDeadlinesMissed);
  milestonesRouter.post('/feature-utilization', milestones.getFeatureUtilization);

  return milestonesRouter;
};
