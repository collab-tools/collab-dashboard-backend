import adminFactory from "./admin";
// import analyticsFactory from './analytics';
// import globalFactory from './global';
import projectsFactory from "./projects";
import usersFactory from "./users";
import milestonesFactory from "./milestones";
import tasksFactory from "./tasks";

module.exports = function(app, express) {
  // Get all  sub-routers and configure the app to use it
  const adminRouter = adminFactory(express);
  const projectsRouter = projectsFactory(express);
  const usersRouter = usersFactory(express);
  const milestonesRouter = milestonesFactory(express);
  const tasksRouter = tasksFactory(express);

  // Configure app to load all the routers
  app.use("/api/admin", adminRouter);
  app.use("/api/milestones", milestonesRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/projects", projectsRouter);
  app.use("/api/users", usersRouter);
};
