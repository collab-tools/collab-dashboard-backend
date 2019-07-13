const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

const getCommitActivities = id => {
  const query = `
SELECT c.date AS timestamp, c.message AS message, c.github_login AS member
FROM commit_logs c
WHERE c.project_id = '${id}'`.trim();
  const githubLoginQuery = `
SELECT u.display_name AS name, u.github_login AS account
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  return sequelize.app
    .query(githubLoginQuery, selectClause)
    .then(members => {
      let accObj = {};
      members.forEach(member => {
        accObj[member.account] = member.name;
      });
      return sequelize.log.query(query, selectClause).then(commits =>
        commits.map(commit => ({
          name: accObj[commit.member],
          description: `pushed a commit '${commit.message}' to branch 'master'`,
          timestamp: commit.timestamp
        }))
      );
    })
    .catch(err => {
      throw err;
    });
};
const getFilesActivities = id => {
  const query = `
SELECT f.email AS author, f.activity AS activity, f.file_name AS fileName, f.date AS timestamp
FROM file_logs f
WHERE f.project_id = '${id}'`.trim();
  const emailQuery = `
SELECT u.display_name AS name, u.email AS email
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  return sequelize.app
    .query(emailQuery, selectClause)
    .then(members => {
      let emailObj = {};
      members.forEach(member => {
        emailObj[member.email] = member.name;
      });
      return sequelize.log.query(query, selectClause).then(activities =>
        activities.map(act => ({
          name: emailObj[act.author],
          description: (() => {
            switch (act.activity) {
              case "C":
                return `created a file '${act.fileName}'`;
              case "U":
                return `made an edit to file '${act.fileName}'`;
              default:
                return `made an unknown action`;
            }
          })(),
          timestamp: act.timestamp
        }))
      );
    })
    .catch(err => {
      throw err;
    });
};
const getTasksActivities = id => {
  const tasksQuery = `
SELECT t.content AS taskName, t.id AS taskId
FROM tasks t
WHERE t.project_id = '${id}'`.trim();
  const nameQuery = `
SELECT u.display_name AS name, u.id AS user_id
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  const query = `
SELECT t.user_id AS user, t.activity AS activity, t.task_id AS task, t.date AS timestamp
FROM task_logs t
WHERE t.project_id = '${id}'`.trim();
  return Promise.all([
    sequelize.app.query(tasksQuery, selectClause),
    sequelize.app.query(nameQuery, selectClause)
  ]).then(([tasks, members]) => {
    let nameObj = {};
    members.forEach(member => {
      nameObj[member.user_id] = member.name;
    });
    let tasksObj = {};
    tasks.forEach(task => {
      tasksObj[task.taskId] = task.taskName;
    });
    return sequelize.log.query(query, selectClause).then(activities =>
      activities.map(act => ({
        name: nameObj[act.user],
        description: (() => {
          switch (act.activity) {
            case "C":
              return tasksObj[act.task]
                ? `created a task '${tasksObj[act.task]}'`
                : "created an unknown task";
            case "U":
              return tasksObj[act.task]
                ? `made an edit to task '${tasksObj[act.task]}'`
                : "made an edit to an unknown task";
            case "D":
              return tasksObj[act.task]
                ? `marked task '${tasksObj[act.task]}' as done`
                : "marked an unknown task as done";
            case "A":
              return tasksObj[act.task]
                ? `assigned task '${tasksObj[act.task]}' to someone`
                : "assigned an unknown task to someone";
            case "X":
              return tasksObj[act.task]
                ? `deleted task '${tasksObj[act.task]}'`
                : "deleted an unknown task";
            default:
              return `made an unknown action`;
          }
        })(),
        timestamp: act.timestamp
      }))
    );
  });
};
const getMilestonesActivities = id => {
  const milestonesQuery = `
SELECT m.content AS milestoneName, m.id AS milestoneId
FROM milestones m
WHERE m.project_id = '${id}'`.trim();
  const nameQuery = `
SELECT u.display_name AS name, u.id AS user_id
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  const query = `
SELECT m.user_id AS user, m.activity AS activity, m.milestone_id AS milestone, m.date AS timestamp
FROM milestone_logs m
WHERE m.project_id = '${id}'`.trim();
  return Promise.all([
    sequelize.app.query(milestonesQuery, selectClause),
    sequelize.app.query(nameQuery, selectClause)
  ]).then(([milestones, members]) => {
    let nameObj = {};
    members.forEach(member => {
      nameObj[member.user_id] = member.name;
    });
    let milestonesObj = {};
    milestones.forEach(milestone => {
      milestonesObj[milestone.milestoneId] = milestone.milestoneName;
    });
    return sequelize.log.query(query, selectClause).then(activities =>
      activities.map(act => ({
        name: nameObj[act.user],
        description: (() => {
          switch (act.activity) {
            case "C":
              return milestonesObj[act.milestone]
                ? `created a milestone '${milestonesObj[act.milestone]}'`
                : "created an unknown milestone";
            case "U":
              return milestonesObj[act.milestone]
                ? `made an edit to milestone '${milestonesObj[act.milestone]}'`
                : "made an edit to an unknown milestone";
            case "X":
              return milestonesObj[act.milestone]
                ? `deleted milestone '${milestonesObj[act.milestone]}'`
                : "deleted an unknown milestone";
            default:
              return `made an unknown action`;
          }
        })(),
        timestamp: act.timestamp
      }))
    );
  });
};
//get 20 most recent activities
exports.getProjectActivities = (req, res) => {
  const id = req.params.id;
  Promise.all([
    getCommitActivities(id),
    getFilesActivities(id),
    getTasksActivities(id),
    getMilestonesActivities(id)
  ])
    .then(activityLists => {
      const activities = Array.prototype.concat.apply([], activityLists);
      activities.sort((act1, act2) => new Date(act2.timestamp) - new Date(act1.timestamp));
      const recentActivities = activities.slice(0, 20);
      res.send(recentActivities);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Error " + err);
    });
};
