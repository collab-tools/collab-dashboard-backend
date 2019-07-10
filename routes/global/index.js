const milestones = require("./milestones");
const projects = require("./projects");
const tasks = require("./tasks");
const users = require("./users");

module.exports = express => {
  const globalRouter = express.Router();

  // milestones related routes
  globalRouter.post("/milestones/count", milestones.getMilestonesCount);
  globalRouter.post("/milestones/completed-count", milestones.getCompletedMilestonesCount);
  globalRouter.post(
    "/milestones/average-milestones-per-project",
    milestones.getAverageMilestonesPerProject
  );
  globalRouter.post(
    "/milestones/average-tasks-per-milestone",
    milestones.getAverageTasksPerMilestone
  );
  globalRouter.post("/milestones/time-taken-data", milestones.getTimeTakenData);
  globalRouter.post("/milestones/ratio-deadlines-missed", milestones.getRatioDeadlinesMissed);
  globalRouter.post("/milestones/feature-utilization", milestones.getFeatureUtilization);

  // projects related routes
  globalRouter.post("/projects/count", projects.getProjectsCount);
  globalRouter.post(
    "/projects/num-created-between-dates",
    projects.getNumProjectsCreatedBetweenDates
  );
  globalRouter.post(
    "/projects/active-rate-between-dates",
    projects.getProjectsActiveRateBetweenDates
  );
  globalRouter.post("/projects/milestones", projects.getMilestones);

  //tasks related routes
  globalRouter.post("/tasks/count", tasks.getTasksCount);
  globalRouter.post("/tasks/count-pending", tasks.getTasksPending);
  globalRouter.post("/tasks/count-completed", tasks.getTasksCompleted);
  globalRouter.post("/tasks/complete-time-data", tasks.getCompleteTimeData);
  globalRouter.post("/tasks/feature-utilization", tasks.getFeatureUtilization);

  //users related routes
  globalRouter.post("/users/count", users.getUsersCount);
  globalRouter.post("/users/num-updated-between-dates", users.getNumUsersUpdatedBetweenDates);
  globalRouter.post("/users/num-created-between-dates", users.getNumUsersCreatedBetweenDates);
  globalRouter.post(
    "/users/num-not-updated-between-dates",
    users.getTotalMinusNumUsersUpdatedBetweenDates
  );
  globalRouter.post("/users/retention-rate", users.getUsersRetentionRate);

  return globalRouter;
};
