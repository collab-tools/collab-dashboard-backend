'use strict';

// import Static from '../static';
var adminFactory = require('./admin');
var analyticsFactory = require('./analytics');
var globalFactory = require('./global');
var projectsFactory = require('./projects');
var usersFactory = require('./users');

module.exports = function (app, express) {
  // Get all four sub-routers and configure the app to use it
  var adminRouter = adminFactory(express);
  var analyticsRouter = analyticsFactory(express);
  var globalRouter = globalFactory(express);
  var projectsRouter = projectsFactory(express);
  var usersRouter = usersFactory(express);

  // app.get('/', Static.index);
  // Configure app to load all the routers
  app.use('/api/admin', adminRouter);
  app.use('/api/analytics', analyticsRouter);
  app.use('/api/global', globalRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/users', usersRouter);
};