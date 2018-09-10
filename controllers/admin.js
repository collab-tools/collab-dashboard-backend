const _ = require('lodash');
const boom = require('boom');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const config = require('config');
const constants = require('../common/constants');
const Storage = require('../common/storage-helper');

const models = new Storage();

function checkDevAccess(devKey) {
  return devKey === config.authentication.privateKey;
}

exports.createAdmin = function(req, res, next) {
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
    console.log(payload);
    const response = (success) => {
      if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
      res.status(200).json({ success });
    };
    return models.log.admin.addUser(payload)
      .then(response)
      .catch(next);
  }

  return next(boom.unauthorized(constants.templates.error.unauthorized));
}

// exports.createAdmin = function(req, res, next) {
//   const devKey = req.body.devKey;
//   const username = req.body.username;
//   const password = req.body.password;
//   console.log(password);
//   const name = req.body.name;
//   const isAdmin = req.body.isAdmin;
//   const settings = req.body.settings || {};


//   if (!checkDevAccess(devKey)) {
//     return next(boom.unauthorized(constants.templates.error.unauthorized));
//   }

//   // Validate that all mandatory fields are given
//   if (!_.isNil(username) && !_.isNil(password) && !_.isNil(name) && !_.isNil(isAdmin)) {
//     const id = uuidv4();
//     const hashedPW = bcrypt.hashSync(password, saltRound);
//     const settingStr = JSON.stringify(settings);

//     const response = (success) => {
//       if (!success) return next(boom.badRequest(constants.templates.error.badRequest));
//       res.status(200).json({ success });
//     };
    

//     const query = 'INSERT INTO admin (id, name, username, password, isAdmin, settings)'
//       + ' VALUES (\''+id+'\', \'' + name + '\', \'' + username + '\', \'' + hashedPW + '\',' + isAdmin + ', \'' + settingStr + '\') '
//       + ';';
//     return sequelize.query(query)
//       .then(response)
//       .catch(next);
//   }

//   return next(boom.unauthorized(constants.templates.error.unauthorized));
// }
