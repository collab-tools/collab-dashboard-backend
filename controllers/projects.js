const sequelize = require('./sequelizeHandler').sequelize;
const selectClause = require('./sequelizeHandler').selectClause;
console.log('Projects Controller Initialized');

exports.getProjectsCount = function (req, res) {
  const query = 'SELECT COUNT(*) as count FROM projects;';
  sequelize.query(query, selectClause).then((result) => {
    res.send(result[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

exports.getNumProjectsCreatedBetweenDates = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedProjectsQuery = 'SELECT COUNT (*) as count FROM projects '
  + 'WHERE created_at between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(datedProjectsQuery, selectClause)
    .then((projects) => {
      res.send(projects[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

exports.getLatestProjects = function (req, res) {
  let maxProjects = req.body.maxProjects;
  if (!maxProjects) maxProjects = 10;

  const query =
  'SELECT p.content, p.github_repo_name, p.created_at, GROUP_CONCAT(display_name) as members '
  + ' FROM projects p'
  + ' JOIN user_projects up ON up.project_id = p.id'
  + ' JOIN users u ON up.user_id = u.id'
  + ' GROUP BY p.id'
  + ' ORDER BY p.created_at DESC LIMIT ' + maxProjects
  + ';';

  sequelize.query(query, selectClause)
    .then((result) => {
      res.send(result);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

//Not very accurate as we determine 'active' via updated_at
exports.getProjectsActiveRateBetweenDates = function (req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const totalQuery = 'SELECT COUNT(*) as count FROM projects ';
  const activeQuery = 'SELECT COUNT(*) as count FROM projects '
  + 'WHERE updated_at between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  sequelize.query(totalQuery, selectClause)
    .then((resultsTotal) => {
      sequelize.query(activeQuery, selectClause)
        .then((resultsActive) => {
          let totalCount = resultsTotal[0].count;
          let activeCount = resultsActive[0].count;
          let rate = activeCount / totalCount;
          res.send({"rate": rate});
      });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};
