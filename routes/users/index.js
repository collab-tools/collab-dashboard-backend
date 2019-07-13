const users = require("./users");
const projects = require("./projects");
const messages = require("./messages");
const activities = require("./activities");
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

  usersRouter.get("/:id/projects", projects.getUserProjects);
  usersRouter.get("/:id/projects/count", projects.getUserProjectsCount);

  usersRouter.get("/:id/messages/count", messages.getUserMessagesCount);

  usersRouter.get("/:id/activities", activities.getUserActivities);

  usersRouter.get("/:id/tasks", tasks.getUserProjectsTasks);
  usersRouter.get("/:id/tasks/count", tasks.getUserTasksCount);
  usersRouter.get("/:id/tasks/contributions", tasks.getUserTasksContributions);

  usersRouter.get("/:id/github/account", github.getUserGithubAccount);
  usersRouter.get("/:id/github/commits", github.getUserCommits);
  usersRouter.get("/:id/github/commitsCount", github.getUserCommitsCount);
  usersRouter.get("/:id/github/linesCount", github.getUserGithubLinesCount);
  usersRouter.get("/:id/github/contributions/commits", github.getUserCommitsContributions);
  usersRouter.get("/:id/github/contributions/LOCs", github.getUserLOCsContributions);

  usersRouter.get("/:id/drive/changes", drive.getUserFileChanges);
  usersRouter.get("/:id/drive/changesCount", drive.getUserFileChangesCount);
  usersRouter.get("/:id/drive/filesCount", drive.getUserFilesCount);
  usersRouter.get("/:id/drive/contributions", drive.getUserFilesContributions);

  return usersRouter;
};
