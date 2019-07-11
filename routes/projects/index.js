const projects = require("./projects");
const messages = require("./messages");
const milestones = require("./milestones");
const tasks = require("./tasks");
const github = require("./github");
const drive = require("./drive");

module.exports = function(express) {
  const projectsRouter = express.Router();

  projectsRouter.post("/", projects.getLatestProjects);
  projectsRouter.get("/:id/name", projects.getProjectName);
  projectsRouter.get("/:id/users", projects.getProjectMembers);
  projectsRouter.get("/:id/dateCreated", projects.getProjectDateCreated);

  projectsRouter.get("/:id/messages/count", messages.getProjectMessagesCount);

  projectsRouter.get("/:id/milestones", milestones.getProjectMilestones);
  projectsRouter.get("/:id/milestones/count", milestones.getProjectMilestonesCount);

  projectsRouter.get("/:id/tasks/", tasks.getProjectTasks);
  projectsRouter.get("/:id/tasks/count", tasks.getProjectTasksCount);
  projectsRouter.get("/:id/tasks/contributions", tasks.getProjectTasksContributions);

  projectsRouter.get("/:id/github/repo", github.getProjectGithubRepo);
  projectsRouter.get("/:id/github/commitsCount", github.getProjectCommitsCount);
  projectsRouter.get("/:id/github/linesCount", github.getProjectGithubLinesCount);
  projectsRouter.get("/:id/github/commits", github.getProjectCommits);
  projectsRouter.get("/:id/github/contributions/commits", github.getProjectCommitsContribution);
  projectsRouter.get("/:id/github/contributions/LOCs", github.getProjectLOCsContribution);

  projectsRouter.get("/:id/drive/link", drive.getProjectDriveLink);
  projectsRouter.get("/:id/drive/changes", drive.getProjectFilesChanges);
  projectsRouter.get("/:id/drive/filesCount", drive.getProjectFilesCount);
  projectsRouter.get("/:id/drive/changesCount", drive.getProjectFileChangesCount);
  projectsRouter.get("/:id/drive/contributions", drive.getProjectFilesContributions);

  return projectsRouter;
};
