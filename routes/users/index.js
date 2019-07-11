const users = require("./users");
const projects = require("./projects");
const messages = require("./messages");
const tasks = require("./tasks");
const github = require("./github");
const drive = require("./drive");

module.exports = express => {
  const usersRouter = express.Router();

  usersRouter.post("/", users.getLatestUsers);
  usersRouter.post("/projects", users.getProjects);
  usersRouter.get("/:id/name", users.getUserName);
  usersRouter.get("/:id/email", users.getUserEmail);
  usersRouter.get("/:id/displayImage", users.getUserImage);

  usersRouter.get("/:id/projects", users.getUserProjects);
  usersRouter.get("/:id/projects/count", users.getUserProjectsCount);

  usersRouter.get("/:id/messages/count", users.getUserMessagesCount);

  usersRouter.get("/:id/tasks", users.getUserProjectsTasks);
  usersRouter.get("/:id/tasks/count", users.getUserTasksCount);
  usersRouter.get("/:id/tasks/contributions", users.getUserTasksContributions);

  usersRouter.get("/:id/github/account", users.getUserGithubAccount);
  usersRouter.get("/:id/github/commits", users.getUserCommits);
  usersRouter.get("/:id/github/commitsCount", users.getUserCommitsCount);
  usersRouter.get("/:id/github/linesCount", users.getUserGithubLinesCount);
  usersRouter.get("/:id/github/contributions/commits", users.getUserCommitsContributions);
  usersRouter.get("/:id/github/contributions/LOCs", users.getUserLOCsContributions);

  usersRouter.get("/:id/drive/changes", users.getUserFileChanges);
  usersRouter.get("/:id/drive/changesCount", users.getUserFileChangesCount);
  usersRouter.get("/:id/drive/filesCount", users.getUserFilesCount);
  usersRouter.get("/:id/drive/contributions", users.getUserFilesContributions);

  return usersRouter;
};
