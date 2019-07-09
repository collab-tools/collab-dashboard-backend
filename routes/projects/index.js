const projects = require("./projects");

module.exports = function(express) {
  const projectsRouter = express.Router();

  projectsRouter.post("/latest", projects.getLatestProjects);

  return projectsRouter;
};
