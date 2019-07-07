const projects = require("./projects");

module.exports = function(express) {
  const projectsRouter = express.Router();

  projectsRouter.post("/count", projects.getProjectsCount);
  projectsRouter.post("/num-created-between-dates", projects.getNumProjectsCreatedBetweenDates);
  projectsRouter.post("/latest", projects.getLatestProjects);
  projectsRouter.post("/active-rate-between-dates", projects.getProjectsActiveRateBetweenDates);
  projectsRouter.post("/milestones", projects.getMilestones);

  return projectsRouter;
};
