const users = require("./users");

module.exports = express => {
  const usersRouter = express.Router();

  usersRouter.post("/latest", users.getLatestUsers);
  usersRouter.post("/projects", users.getProjects);

  return usersRouter;
};
