const users = require("./users");

module.exports = express => {
  const usersRouter = express.Router();

  // New Dashboard API
  usersRouter.post("/count", users.getUsersCount);
  usersRouter.post("/num-updated-between-dates", users.getNumUsersUpdatedBetweenDates);
  usersRouter.post("/num-created-between-dates", users.getNumUsersCreatedBetweenDates);
  usersRouter.post(
    "/num-not-updated-between-dates",
    users.getTotalMinusNumUsersUpdatedBetweenDates
  );
  usersRouter.post("/retention-rate", users.getUsersRetentionRate);
  usersRouter.post("/latest", users.getLatestUsers);
  usersRouter.post("/projects", users.getProjects);

  return usersRouter;
};
