const fetch = require("node-fetch");
const sequelize = require("../sequelizeHandler").sequelize;
const selectClause = require("../sequelizeHandler").selectClause;

const githubCred = {
  client_id: "22ef37d433f7ca86bdf3",
  client_secret: "2fbe0535991f38ce06684071244132d1cc6d3843"
};

exports.getProjectGithubRepo = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT p.github_repo_owner AS owner, p.github_repo_name AS repo
FROM projects p
WHERE p.id = '${id}'`.trim();
  sequelize.app
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectCommitsCount = function(req, res) {
  const id = req.params.id;
  const query = `
SELECT COUNT(c.id) AS count
FROM commit_logs c
WHERE c.project_id = '${id}'`.trim();
  sequelize.log
    .query(query, selectClause)
    .then(result => {
      res.send(result[0]);
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectGithubLinesCount = function(req, res) {
  const id = req.params.id;
  const type = req.query.type;
  const repoQuery = `
SELECT p.github_repo_owner AS owner, p.github_repo_name AS repo
FROM projects p
WHERE p.id = '${id}'`.trim();
  sequelize.app
    .query(repoQuery, selectClause)
    .then(result => {
      let repoLocation = result[0].repo ? `${result[0].owner}/${result[0].repo}` : "";
      return repoLocation;
    })
    .then(repoLocation => {
      if (repoLocation) {
        fetch(
          `https://api.github.com/repos/${repoLocation}/stats/code_frequency?client_id=${
            githubCred.client_id
          }&client_secret=${githubCred.client_secret}`
        )
          .then(res => res.json())
          .then(stats =>
            stats.reduce(
              (sum, current) =>
                type === "addition" ? sum + current[1] : sum + Math.abs(current[2]),
              0
            )
          )
          .then(count => res.send({ count }));
      } else {
        res.send({ count: 0 });
      }
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectCommits = function(req, res) {
  const id = req.params.id;
  const githubLoginQuery = `
SELECT u.display_name AS name, u.github_login AS account
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  sequelize.app
    .query(githubLoginQuery, selectClause)
    .then(members => {
      let accObj = {};
      members.forEach(member => {
        accObj[member.account] = member.name;
      });
      return accObj;
    })
    .then(accObj => {
      const query = `
SELECT c.github_login AS author, c.message AS message, c.date AS timestamp, c.sha as SHA
FROM commit_logs c
WHERE c.project_id = '${id}'
ORDER BY timestamp DESC`.trim();
      sequelize.log.query(query, selectClause).then(commits => {
        commits.forEach(commit => (commit.author = accObj[commit.author] || commit.author));
        res.send(commits);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectCommitsContribution = function(req, res) {
  const id = req.params.id;
  const githubLoginQuery = `
SELECT u.display_name AS name, u.github_login AS account
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  sequelize.app
    .query(githubLoginQuery, selectClause)
    .then(members => {
      let accObj = {};
      members.forEach(member => {
        accObj[member.account] = member.name;
      });
      return accObj;
    })
    .then(accObj => {
      const query = `
SELECT COUNT(c.id) AS commits, c.github_login AS member
FROM commit_logs c
WHERE c.project_id = '${id}'
GROUP BY member`.trim();
      sequelize.log.query(query, selectClause).then(contrs => {
        contrs.forEach(contr => (contr.member = accObj[contr.member] || contr.member));
        res.send(contrs);
      });
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};

exports.getProjectLOCsContribution = function(req, res) {
  const id = req.params.id;
  const githubLoginQuery = `
SELECT u.display_name AS name, u.github_login AS account
FROM users u
JOIN user_projects up ON up.user_id = u.id
WHERE up.project_id = '${id}'`.trim();
  const repoQuery = `
SELECT p.github_repo_owner AS owner, p.github_repo_name AS repo
FROM projects p
WHERE p.id = '${id}'`.trim();
  Promise.all([
    sequelize.app.query(githubLoginQuery, selectClause),
    sequelize.app.query(repoQuery, selectClause)
  ])
    .then(([members, repoInfo]) => {
      let accObj = {};
      members.forEach(member => {
        accObj[member.account] = member.name;
      });
      let repoLocation = repoInfo[0].repo ? `${repoInfo[0].owner}/${repoInfo[0].repo}` : "";
      if (repoLocation) {
        fetch(
          `https://api.github.com/repos/${repoLocation}/stats/contributors?client_id=${
            githubCred.client_id
          }&client_secret=${githubCred.client_secret}`
        )
          .then(res => res.json())
          .then(contributors =>
            contributors.map(contr => ({
              member: contr.author.login,
              additions: contr.weeks.reduce((sum, curr) => sum + curr.a, 0),
              deletions: contr.weeks.reduce((sum, curr) => sum + curr.d, 0)
            }))
          )
          .then(contrs => {
            contrs.forEach(contr => (contr.member = accObj[contr.member] || contr.member));
            res.send(contrs);
          });
      } else {
        res.send({ count: 0 });
      }
    })
    .catch(err => {
      res.status(400).send("Error " + err);
    });
};
