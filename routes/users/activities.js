const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

const getCommitActivities = id => {
  const githubLoginQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();
  const projectQuery = `
SELECT p.content AS projectName, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();

  return Promise.all([
    sequelize.app.query(githubLoginQuery, selectClause),
    sequelize.app.query(projectQuery, selectClause)
  ])
    .then(([acc, projects]) => {
      let projObj = {};
      projects.forEach(proj => {
        projObj[proj.projectId] = proj.projectName;
      });
      const query = `
SELECT c.date AS timestamp, c.message AS message, c.project_id AS project
FROM commit_logs c
WHERE c.github_login = '${acc[0].account}'`.trim();
      return sequelize.log.query(query, selectClause).then(commits =>
        commits.map(commit => ({
          project: projObj[commit.project],
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
  const emailQuery = `
SELECT u.email AS email
FROM users u
WHERE u.id = '${id}'`.trim();
  const projectQuery = `
SELECT p.content AS projectName, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();
  return Promise.all([
    sequelize.app.query(emailQuery, selectClause),
    sequelize.app.query(projectQuery, selectClause)
  ])
    .then(([email, projects]) => {
      let projObj = {};
      projects.forEach(proj => {
        projObj[proj.projectId] = proj.projectName;
      });
      const query = `
SELECT f.date AS timestamp, f.activity AS activity, f.file_name AS fileName, f.project_id AS project
FROM file_logs f
WHERE f.email = '${email[0].email}'`.trim();
      return sequelize.log.query(query, selectClause).then(activities =>
        activities.map(act => ({
          project: projObj[act.project],
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
JOIN user_projects up ON up.project_id = t.project_id
WHERE up.user_id = '${id}'`.trim();
  const projectQuery = `
SELECT p.content AS projectName, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();
  const query = `
SELECT t.project_id AS project, t.activity AS activity, t.task_id AS task, t.date AS timestamp
FROM task_logs t
WHERE t.user_id = '${id}'`.trim();
  return Promise.all([
    sequelize.app.query(tasksQuery, selectClause),
    sequelize.app.query(projectQuery, selectClause)
  ]).then(([tasks, projects]) => {
    let projObj = {};
    projects.forEach(proj => {
      projObj[proj.projectId] = proj.projectName;
    });
    let tasksObj = {};
    tasks.forEach(task => {
      tasksObj[task.taskId] = task.taskName;
    });
    return sequelize.log.query(query, selectClause).then(activities =>
      activities.map(act => ({
        project: projObj[act.project],
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
JOIN user_projects up ON up.project_id = m.project_id
WHERE up.user_id = '${id}'`.trim();
  const projectQuery = `
SELECT p.content AS projectName, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();
  const query = `
SELECT m.project_id AS project, m.activity AS activity, m.milestone_id AS milestone, m.date AS timestamp
FROM milestone_logs m
WHERE m.user_id = '${id}'`.trim();
  return Promise.all([
    sequelize.app.query(milestonesQuery, selectClause),
    sequelize.app.query(projectQuery, selectClause)
  ]).then(([milestones, projects]) => {
    let projObj = {};
    projects.forEach(proj => {
      projObj[proj.projectId] = proj.projectName;
    });
    let milestonesObj = {};
    milestones.forEach(milestone => {
      milestonesObj[milestone.milestoneId] = milestone.milestoneName;
    });
    return sequelize.log.query(query, selectClause).then(activities =>
      activities.map(act => ({
        project: projObj[act.project],
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

exports.getUserActivities = (req, res) => {
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
