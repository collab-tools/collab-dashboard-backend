const fetch = require("node-fetch");
const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

const githubCred = {
  client_id: "22ef37d433f7ca86bdf3",
  client_secret: "2fbe0535991f38ce06684071244132d1cc6d3843"
};

exports.getUserGithubAccount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserCommits = function(req, res) {
  const id = req.params.id;
  const githubLoginQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();
  const projectNameAndRepoQuery = `
SELECT p.content AS name, p.id AS projectId, CONCAT(p.github_repo_owner, "/", p.github_repo_name) AS repo
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'
AND p.github_repo_name IS NOT NULL`.trim();
  Promise.all([
    sequelize.app.query(githubLoginQuery, selectClause),
    sequelize.app.query(projectNameAndRepoQuery, selectClause)
  ])
    .then(([account, projects]) => {
      let projObj = {};
      projects.forEach(({ name, projectId, repo }) => {
        projObj[projectId] = { name, repo };
      });
      const query = `
SELECT c.project_id AS project, c.message AS message, c.date AS timestamp, c.sha AS SHA
FROM commit_logs c
WHERE c.github_login = '${account[0].account}'
ORDER BY timestamp DESC`.trim();
      sequelize.log.query(query, selectClause).then(commits => {
        commits.forEach(commit => {
          commit.repo = projObj[commit.project].repo;
          commit.project = projObj[commit.project].name;
        });
        res.send(commits);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserCommitsCount = function(req, res) {
  const id = req.params.id;
  const projectId = req.query.project;
  const githubQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();

  sequelize.app
    .query(githubQuery, selectClause)
    .then(result1 => result1[0].account)
    .then(acc => {
      let query = `
SELECT COUNT(c.id) AS count
FROM commit_logs c
WHERE c.github_login = '${acc}'`.trim();
      if (projectId) query += ` AND c.project_id = '${projectId}'`;
      sequelize.log.query(query, selectClause).then(result2 => {
        res.send(result2[0]);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserGithubLinesCount = function(req, res) {
  const id = req.params.id;
  const type = req.query.type;
  let repoQuery = `
SELECT CONCAT(p.github_repo_owner, "/", p.github_repo_name) AS repo
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'
AND p.github_repo_name IS NOT NULL`.trim();
  let accountQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();
  Promise.all([
    sequelize.app.query(repoQuery, selectClause),
    sequelize.app.query(accountQuery, selectClause)
  ])
    .then(async ([repos, account]) => {
      let sum = 0;
      for (const repo of repos) {
        await fetch(
          `https://api.github.com/repos/${repo.repo}/stats/contributors?client_id=${
            githubCred.client_id
          }&client_secret=${githubCred.client_secret}`
        )
          .then(res => res.json())
          .then(contributors =>
            contributors
              .find(contr => contr.author.login === account[0].account)
              .weeks.reduce((sum, curr) => sum + (type === "addition" ? curr.a : curr.d), 0)
          )
          .then(lines => {
            sum += lines;
          });
      }
      res.send({ count: sum });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserCommitsContributions = function(req, res) {
  const id = req.params.id;
  const githubLoginQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();
  const projectNameQuery = `
SELECT p.content AS name, p.id AS projectId
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'`.trim();
  Promise.all([
    sequelize.app.query(githubLoginQuery, selectClause),
    sequelize.app.query(projectNameQuery, selectClause)
  ])
    .then(([account, projects]) => {
      let projObj = {};
      projects.forEach(proj => {
        projObj[proj.projectId] = proj.name;
      });
      const query = `
SELECT c.project_id AS project, COUNT(c.id) AS commits
FROM commit_logs c
WHERE c.github_login = '${account[0].account}'
GROUP BY project`.trim();
      sequelize.log.query(query, selectClause).then(contrs => {
        contrs.forEach(contr => (contr.project = projObj[contr.project]));
        res.send(contrs);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getUserLOCsContributions = function(req, res) {
  const id = req.params.id;
  const githubLoginQuery = `
SELECT u.github_login AS account
FROM users u
WHERE u.id = '${id}'`.trim();
  const projectNameAndRepoQuery = `
SELECT p.content AS name, p.id AS projectId, CONCAT(p.github_repo_owner, "/", p.github_repo_name) AS repo
FROM projects p
JOIN user_projects up ON p.id = up.project_id
WHERE up.user_id = '${id}'
AND p.github_repo_name IS NOT NULL`.trim();
  Promise.all([
    sequelize.app.query(githubLoginQuery, selectClause),
    sequelize.app.query(projectNameAndRepoQuery, selectClause)
  ])
    .then(async ([account, projects]) => {
      const contributions = [];
      for (const proj of projects) {
        await fetch(
          `https://api.github.com/repos/${proj.repo}/stats/contributors?client_id=${
            githubCred.client_id
          }&client_secret=${githubCred.client_secret}`
        )
          .then(res => res.json())
          .then(contributors =>
            contributors
              .find(contr => contr.author.login === account[0].account)
              .weeks.reduce(
                (sum, curr) => ({
                  project: sum.project,
                  additions: sum.additions + curr.a,
                  deletions: sum.deletions + curr.d
                }),
                { project: proj.name, additions: 0, deletions: 0 }
              )
          )
          .then(contr => contributions.push(contr));
      }
      res.send(contributions);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
