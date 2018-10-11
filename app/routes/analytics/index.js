const config = require('config');
const jwt = require('express-jwt');

module.exports = function (express) {
  const analyticsRouter = express.Router();
  const auth = jwt({
    secret: config.jwt_secret,
    userProperty: 'auth'
  });

  analyticsRouter.use(auth);

  return analyticsRouter;
};
