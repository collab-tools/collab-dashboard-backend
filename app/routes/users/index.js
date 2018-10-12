const config = require('config');
const jwt = require('express-jwt');
const github = require('./github');
const drive = require('./drive');
const cloud = require('./cloud');
const tasks = require('./tasks');
const milestones = require('./milestones');
const users = require('./users');
const authController = require('../auth');

module.exports = (express) => {
  const usersRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  usersRouter.use(auth);

  // New Dashboard API
  usersRouter.post('/count', authController.jwtAuthenticated, users.getUsersCount);
  usersRouter.post('/num-created-between-dates', users.getNumUsersCreatedBetweenDates);
  usersRouter.post('/num-not-updated-between-dates', users.getTotalMinusNumUsersUpdatedBetweenDates);
  usersRouter.post('/retention-rate', users.getUsersRetentionRate);
  usersRouter.post('/latest', users.getLatestUsers);
  

  // User Retrieval Related
  // =========================================================
  usersRouter.get('/', users.getUsers);
  usersRouter.get('/:userId', users.getUser);
  usersRouter.get('/:userId/projects', users.getUserProjects);

  // GitHub Related
  // =========================================================
  usersRouter.get('/:userId/github/repos', github.getUserRepos);
  usersRouter.get('/:userId/github/commits', github.getUserCommits);
  usersRouter.get('/:userId/github/releases', github.getUserReleases);
  usersRouter.get('/:userId/project/:projectId/github/repo', github.getProjectRepo);
  usersRouter.get('/:userId/project/:projectId/github/commits', github.getProjectCommits);
  usersRouter.get('/:userId/project/:projectId/github/releases', github.getProjectReleases);

  // Google Drive Related
  // =========================================================
  usersRouter.get('/:userId/drive/files', drive.getUserFiles);
  usersRouter.get('/:userId/drive/changes', drive.getUserChanges);
  usersRouter.get('/:userId/drive/activities', drive.getUserActivities);
  usersRouter.get('/:userId/project/:projectId/drive/files', drive.getProjectFiles);
  usersRouter.get('/:userId/project/:projectId/drive/changes', drive.getProjectChanges);
  usersRouter.get('/:userId/project/:projectId/drive/activities', drive.getProjectActivities);

  // Tasks Related
  // =========================================================
  usersRouter.get('/:userId/tasks', tasks.getUserTasks);
  usersRouter.get('/:userId/tasks/activities', tasks.getUserActivities);
  usersRouter.get('/:userId/project/:projectId/tasks', tasks.getProjectTasks);
  usersRouter.get('/:userId/project/:projectId/tasks/activities', tasks.getProjectActivities);

  // Milestones Related
  // =========================================================
  usersRouter.get('/:userId/milestones', milestones.getUserMilestones);
  usersRouter.get('/:userId/milestones/activities', milestones.getUserActivities);
  usersRouter.get('/:userId/milestones/assigned', milestones.getAssignedUserMilestones);
  usersRouter.get('/:userId/milestones/tasks', milestones.getTasksByMilestones);
  usersRouter.get('/:userId/project/:projectId/milestones/activities', milestones.getActivitiesByProjectMilestones);
  usersRouter.get('/:userId/project/:projectId/milestones/assigned', milestones.getAssignedProjectMilestones);
  usersRouter.get('/:userId/project/:projectId/milestones/tasks', milestones.getTasksByProjectMilestones);

  // Cloud IDE Related
  // =========================================================
  usersRouter.get('/:userId/cloud/overview', cloud.getOverview);

  return usersRouter;
};