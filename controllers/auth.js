const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = {
  jwtSecret: 'mySecret',
  jwtExpiresInSeconds: '600000'
}

//Local Login for forms, where username & password are provided in body
passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with username
    usernameField : 'username',
    passwordField : 'password',
    session:false,
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, usernameOrEmail, password, callback) { // callback with username and password from our form
    if (usernameOrEmail === 'rebekah' && password === 'password') {
      // Success
      const user = {
        username: usernameOrEmail
      }
      req.headers.user = user;
      return callback(null, user);
    } else {
      return callback(null, false);
    }
  }
));

const jwtStrategyOptions = {
  jwtFromRequest : ExtractJwt.fromAuthHeaderWithScheme("jwt"),
  secretOrKey : config.jwtSecret
};
//Jwt Authentication to authenticate using header data
/* Example Header Data =
{
  Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJlYmVrYWgiLCJpYXQiOjE1MjAzNTEwNDYsImV4cCI6MTUyMDM1MTY0Nn0.fqUDuz72G8GJmWTVc4E2u6Aq5G7gdosOAEC2c3D9pvY
} */
passport.use('jwt-login', new JwtStrategy(jwtStrategyOptions,
  function(jwt_payload, done_callback) {
    const user = {
      username: jwt_payload.username
    ;
    if (!jwt_payload) {
      return done_callback (null, false);
    }
    if (jwt_payload.username === 'rebekah') {
      return done_callback (null, user);
    }
  }
));

passport.serializeUser(function(user, done) {
  // console.log('serializeUser ' + JSON.stringify(user));
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // console.log('deserializeUser ' + JSON.stringify(user));
  done(null, user);
});

//Login endpoint
exports.login = function(req, res, next) {
  //Injected user object by auth
  const user = req.headers.user;
  console.log('user = ' + JSON.stringify(user));
  const strippedUser = {
    username: user.username
  };
  const token = jwt.sign(strippedUser, config.jwtSecret, {expiresIn : config.jwtExpiresInSeconds});
  res.send({
    username: user.username,
    sessionToken: token
  });
};

exports.localAuthenticated = passport.authenticate('local-login');
exports.jwtAuthenticated = passport.authenticate('jwt-login');
