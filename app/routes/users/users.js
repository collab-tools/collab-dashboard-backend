const _ = require('lodash');
const boom = require('boom');
const moment = require('moment');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');

const models = new Storage();

function getUser(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;

  const response = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(_.head(user));
  };

  return models.app.user.getUserWithProjects(userId)
    .then(response)
    .catch(next);
}

function getUsers(req, res, next) {
  req.query.start = parseInt(req.query.start, 10) || constants.defaults.startDate;
  req.query.end = parseInt(req.query.end, 10) || constants.defaults.endDate;
  req.checkQuery('start', `start ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  req.checkQuery('end', `end ${constants.templates.error.invalidData}`).isInt({ min: 0 });
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const startDate = moment(req.query.start).format('YYYY-MM-DD HH:mm:ss');
  const endDate = moment(req.query.end).format('YYYY-MM-DD HH:mm:ss');

  const response = (users) => {
    if (_.isNil(users)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(users);
  };

  return models.app.user.getUsersWithProjects(startDate, endDate)
    .then(response)
    .catch(next);
}

function getUserProjects(req, res, next) {
  req.checkParams('userId', `userId ${constants.templates.error.missingParam}`).notEmpty();
  const errors = req.validationErrors();
  if (errors) return next(boom.badRequest(errors));

  const userId = req.params.userId;

  const retrieveProjects = (user) => {
    if (_.isNil(user)) return next(boom.badRequest(constants.templates.error.badRequest));
    return user.getProjects();
  };

  const response = (projects) => {
    if (_.isNil(projects)) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json(projects);
  };

  return models.app.user.getUserById(userId)
    .then(retrieveProjects)
    .then(response)
    .catch(next);
}

function getUsersCount(req, res, next) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const query = 'SELECT COUNT(*) as count FROM users'
  + ' WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';
  models.app.query(query, selectClause)
  .then((result) => {
    console.log('result = ' + JSON.stringify(selectClause));
    const count = result[0].count;
    res.send({
  	  count: count
    });
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
}

function getNumUsersCreatedBetweenDates(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE DATE(created_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  models.app.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

function getNumUsersUpdatedBetweenDates(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  models.app.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

function getTotalMinusNumUsersUpdatedBetweenDates(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE NOT DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  models.app.query(datedUsersQuery, selectClause)
    .then((users) => {
      res.send(users[0]);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

function getUsersRetentionRate(req, res) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  const totalUsersQuery = 'SELECT COUNT (*) as count FROM users';
  const datedUsersQuery = 'SELECT COUNT (*) as count FROM users '
  + 'WHERE DATE(updated_at) between \'' + startDate + '\' AND \'' + endDate + '\''
  + ';';

  models.app.query(totalUsersQuery, selectClause)
    .then((total) => {
      models.app.query(datedUsersQuery, selectClause)
        .then((active) => {
          const totalCount = total[0].count;
          const numActive = active[0].count;
          const rate = (numActive/totalCount);
          res.send({
            rate: rate
          });
        })
      }
    )
    .catch(function (err) {
      res.status(400).send('Error ' + err);
    });
};

function getLatestUsers(req, res) {
  let maxUsers = req.body.maxUsers;
  if (!maxUsers) maxUsers = 10;

  const datedUsersQuery =
  'SELECT u.display_name, u.email, u.github_login, u.created_at, GROUP_CONCAT(content) as user_projects, u.id as user_id '
  + ' FROM users u'
  + ' JOIN user_projects up ON up.user_id = u.id'
  + ' JOIN projects p ON up.project_id = p.id'
  + ' GROUP BY u.id'
  + ' ORDER BY DATE(u.created_at) DESC LIMIT ' + maxUsers
  + ';';

  models.app.query(datedUsersQuery, selectClause)
    .then((datedUsers) => {
      res.send(datedUsers);
  })
  .catch(function (err) {
    res.status(400).send('Error ' + err);
  });
};

const usersAPI = { getUser, getUsers, getUserProjects, 
  getUsersCount, getNumUsersCreatedBetweenDates, getNumUsersUpdatedBetweenDates,
  getTotalMinusNumUsersUpdatedBetweenDates, getUsersRetentionRate, getLatestUsers };

module.exports = usersAPI;
