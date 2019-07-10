const users = require("./users");

module.exports = express => {
  const usersRouter = express.Router();

  usersRouter.post("/", users.getLatestUsers);
  usersRouter.post("/projects", users.getProjects);
  usersRouter.get("/:id/name", users.getUserName);
  usersRouter.get("/:id/email", users.getUserEmail);
  usersRouter.get("/:id/displayImage", users.getUserImage);
  usersRouter.get("/:id/tasks/count", users.getTasksCount);
  usersRouter.get("/:id/messages/count", users.getMessagesCount);
  usersRouter.get("/:id/github/commitsCount", users.getCommitsCount);
  usersRouter.get("/:id/drive/changesCount", users.getFileChangesCount);

  return usersRouter;
};
