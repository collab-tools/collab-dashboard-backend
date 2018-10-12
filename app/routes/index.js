// import Static from '../static';
const adminFactory = require('./admin');
const analyticsFactory = require('./analytics');
const globalFactory = require('./global');
const projectsFactory = require('./projects');
const usersFactory = require('./users');
const milestonesFactory = require('./milestones');
const tasksFactory = require('./tasks');

module.exports = function (app, express) {
  // Get all four sub-routers and configure the app to use it
  const adminRouter = adminFactory(express);
  const analyticsRouter = analyticsFactory(express);
  const globalRouter = globalFactory(express);
  const projectsRouter = projectsFactory(express);
  const usersRouter = usersFactory(express);
  const milestoneRouter = milestonesFactory(express);
  const tasksRouter = tasksFactory(express);

  // app.get('/', Static.index);
  // Configure app to load all the routers
  app.use('/api/admin', adminRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/global', globalRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/milestones', milestoneRouter);
  app.use('/api/tasks', tasksRouter);
};
