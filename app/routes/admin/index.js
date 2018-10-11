const _ = require('lodash');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const config = require('config');
const constants = require('../../common/constants');
const Storage = require('../../common/storage-helper');

const models = new Storage();

function checkDevAccess(devKey) {
  return devKey === config.developer_key;
}

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res, next) {
  const givenUser = req.body.username;
  const givenPass = req.body.password;
  const searchParameter = { username: givenUser };
  console.log(givenUser, givenPass);

  const authenticateUser = (user) => {
    if (_.isNil(user)) return next(boom.unauthorized(constants.templates.error.unauthorized));
    const isValidated = user.comparePassword(givenPass);
    if (!isValidated) return next(boom.unauthorized(constants.templates.error.unauthorized));

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
    const payload = {
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };

    const token = jwt.sign(payload, config.jwt_secret);
    res.status(200).json({ success: true, token, settings: user.settings, isAdmin: user.isAdmin, username: user.username });
  };

  return models.log.admin.findOne({where: searchParameter})
  .then(authenticateUser)
  .catch(next);
}

function createAdmin(req, res, next) {
  const devKey = req.body.devKey;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const isAdmin = req.body.isAdmin;
  const settings = req.body.settings || {};

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(isAdmin)) {
    const payload = { username, password, name, isAdmin, settings: JSON.stringify(settings) };
    const response = (success) => {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      const staff = success[1][0];
      staff.password = null;
      res.status(200).json({ staff });
    };
    return models.log.admin.addUser(payload)
      .then(response)
      .catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

function updateAdmin(req, res, next) {
  const devKey = req.body.devKey;
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const isAdmin = req.body.isAdmin;
  const settings = req.body.settings;

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(isAdmin)) {
    const payload = { username, password, name, isAdmin, settings: JSON.stringify(settings) };
    const response = (success) => {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      const staff = success[1][0];
      staff.password = null;
      res.status(200).json({ staff });
    };

    const adminUpdate = {
      username,
      password,
      name,
      isAdmin,
      settings,
    };

    return models.log.admin.updateUser(adminUpdate)
    .then(response)
    .catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

// function updateAdmin(req, res, next) {
//   const adminUpdate = req.body.admin;
//   adminUpdate.username = req.auth.username;
//   const response = (updates) => {
//     if (!updates) return next(boom.badRequest(constants.templates.error.badRequest));
//     const user = updates[1][0];
//     const expiry = new Date();
//     expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
//     const payload = {
//       name: user.name,
//       username: user.username,
//       isAdmin: user.isAdmin,
//       exp: parseInt(expiry.getTime() / 1000, 10)
//     };
//     const token = jwt.sign(payload, config.jwt_secret);
//     res.status(200).json({ success: true, token, settings: user.settings });
//   };

//   return models.log.admin.updateUser(adminUpdate)
//     .then(response)
//     .catch(next);
// }

function getAll(req, res, next) {
  const response = (success) => {
    if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({ success });
  };

  return models.log.admin.getAll()
    .then(response)
    .catch(next);
}

function getOne(req, res, next) {
  const devKey = req.body.devKey;
  const id = req.body.id;

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  if (!_.isNil(id)) {
    const response = (staff) => {
      if (!staff) return next(boom.badRequest(constants.templates.error.badRequest));
      staff.password = null;
      res.status(200).json(staff);
    };
  
    return models.log.admin.findById(id)
      .then(response)
      .catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

module.exports = function (express) {
  const auth = expressJwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  const adminRouter = express.Router();

  // Dashboard Administration Endpoints
  // =========================================================
  adminRouter.post('/authenticate', authenticate);
  adminRouter.get('/all', getAll);
  adminRouter.post('/detail', getOne);

  // Developer Accessible Endpoints
  // =========================================================
  adminRouter.post('/', createAdmin);
  adminRouter.put('/', updateAdmin);
  
  return adminRouter;
};
