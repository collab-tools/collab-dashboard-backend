'use strict';

var config = require('config');
var jwt = require('express-jwt');

module.exports = function (express) {
  var analyticsRouter = express.Router();
  var auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  analyticsRouter.use(auth);

  return analyticsRouter;
};