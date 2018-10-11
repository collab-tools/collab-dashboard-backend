'use strict';

var _ = require('lodash');
var boom = require('boom');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var config = require('config');
var constants = require('../../common/constants');
var Storage = require('../../common/storage-helper');

var models = new Storage();

function checkDevAccess(devKey) {
  return devKey === config.developer_key;
}

/**
 * Authenticate an administrator and return JWT if valid else return 401 error.
 */
function authenticate(req, res, next) {
  var givenUser = req.body.username;
  var givenPass = req.body.password;
  var searchParameter = { username: givenUser };
  console.log(givenUser, givenPass);

  var authenticateUser = function authenticateUser(user) {
    if (_.isNil(user)) return next(boom.unauthorized(constants.templates.error.unauthorized));
    var isValidated = user.comparePassword(givenPass);
    if (!isValidated) return next(boom.unauthorized(constants.templates.error.unauthorized));

    var expiry = new Date();
    expiry.setDate(expiry.getDate() + constants.defaults.jwtExpiry);
    var payload = {
      name: user.name,
      username: user.username,
      isAdmin: user.isAdmin,
      exp: parseInt(expiry.getTime() / 1000, 10)
    };

    var token = jwt.sign(payload, config.jwt_secret);
    res.status(200).json({ success: true, token: token, settings: user.settings, isAdmin: user.isAdmin, username: user.username });
  };

  return models.log.admin.findOne({ where: searchParameter }).then(authenticateUser).catch(next);
}

function createAdmin(req, res, next) {
  var devKey = req.body.devKey;
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var isAdmin = req.body.isAdmin;
  var settings = req.body.settings || {};

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(isAdmin)) {
    var payload = { username: username, password: password, name: name, isAdmin: isAdmin, settings: JSON.stringify(settings) };
    var response = function response(success) {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      var staff = success[1][0];
      staff.password = null;
      res.status(200).json({ staff: staff });
    };
    return models.log.admin.addUser(payload).then(response).catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

function updateAdmin(req, res, next) {
  var devKey = req.body.devKey;
  var username = req.body.username;
  var password = req.body.password;
  var name = req.body.name;
  var isAdmin = req.body.isAdmin;
  var settings = req.body.settings;

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  // Validate that all mandatory fields are given
  if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(isAdmin)) {
    var payload = { username: username, password: password, name: name, isAdmin: isAdmin, settings: JSON.stringify(settings) };
    var response = function response(success) {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      var staff = success[1][0];
      staff.password = null;
      res.status(200).json({ staff: staff });
    };

    var adminUpdate = {
      username: username,
      password: password,
      name: name,
      isAdmin: isAdmin,
      settings: settings
    };

    return models.log.admin.updateUser(adminUpdate).then(response).catch(next);
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
  var response = function response(success) {
    if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
    res.status(200).json({ success: success });
  };

  return models.log.admin.getAll().then(response).catch(next);
}

function getOne(req, res, next) {
  var devKey = req.body.devKey;
  var id = req.body.id;

  if (!checkDevAccess(devKey)) {
    return next(boom.unauthorized(constants.templates.error.unauthorized));
  }

  if (!_.isNil(id)) {
    var response = function response(staff) {
      if (!staff) return next(boom.badRequest(constants.templates.error.badRequest));
      staff.password = null;
      res.status(200).json(staff);
    };

    return models.log.admin.findById(id).then(response).catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

module.exports = function (express) {
  var auth = expressJwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  var adminRouter = express.Router();

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