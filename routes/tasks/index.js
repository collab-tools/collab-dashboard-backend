const tasks = require("./tasks");

module.exports = express => {
  const tasksRouter = express.Router();

  tasksRouter.post("/count", tasks.getTasksCount);
  tasksRouter.post("/count-pending", tasks.getTasksPending);
  tasksRouter.post("/count-completed", tasks.getTasksCompleted);
  tasksRouter.post("/complete-time-data", tasks.getCompleteTimeData);
  tasksRouter.post("/feature-utilization", tasks.getFeatureUtilization);

  return tasksRouter;
};
