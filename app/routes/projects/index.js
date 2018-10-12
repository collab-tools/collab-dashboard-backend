const config = require('config');
const jwt = require('express-jwt');
const github = require('./github');
const drive = require('./drive');
const cloud = require('./cloud');
const tasks = require('./tasks');
const milestones = require('./milestones');
const projects = require('./projects');

module.exports = function(express) {
  const projectsRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  projectsRouter.use(auth);

  // New Dashboard API
  // =========================================================
  projectsRouter.post('/count', projects.getProjectsCount);
  projectsRouter.post('/num-created-between-dates', projects.getNumProjectsCreatedBetweenDates);
  projectsRouter.post('/latest', projects.getLatestProjects);
  projectsRouter.post('/active-rate-between-dates', projects.getProjectsActiveRateBetweenDates);
  projectsRouter.post('/milestones', projects.getMilestones);

  // Projects Retrieval Related
  // =========================================================
  projectsRouter.get('/', projects.getProjects);
  projectsRouter.get('/:projectId', projects.getProject);
  projectsRouter.get('/:projectId/users', projects.getUsers);

  // GitHub Related
  // =========================================================
  projectsRouter.get('/:projectId/github/repo', github.getRepo);
  projectsRouter.get('/:projectId/github/commits', github.getCommits);
  projectsRouter.get('/:projectId/github/releases', github.getReleases);
  projectsRouter.get('/:projectId/github/contributors', github.getContributors);
  projectsRouter.get('/:projectId/github/stats', github.getStatistics);

  // Google Drive Related
  // =========================================================
  projectsRouter.get('/:projectId/drive/files', drive.getFiles);
  projectsRouter.get('/:projectId/drive/changes', drive.getChanges);
  projectsRouter.get('/:projectId/drive/activities', drive.getActivities);

  // Tasks Related
  // =========================================================
  projectsRouter.get('/:projectId/tasks', tasks.getTasks);
  projectsRouter.get('/:projectId/tasks/activities', tasks.getActivities);

  // Milestones Related
  // =========================================================
  projectsRouter.get('/:projectId/milestones', milestones.getMilestones);
  projectsRouter.get('/:projectId/milestones/activities', milestones.getActivities);
  projectsRouter.get('/:projectId/milestones/tasks', milestones.getTasksByMilestones);

  // Cloud IDE Related
  // =========================================================
  projectsRouter.get('/:projectId/cloud/overview', cloud.getOverview);

  return projectsRouter;
};
