const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = {
  jwtSecret: 'mySecret',
  jwtExpiresInSeconds: (60 * 60 * 2)
}
// const googleCred = {
//   "client_id": "183936930394-i706s7cn9fttmhqv7dh7rkqs3nkod37f.apps.googleusercontent.com",
//   "client_secret": "uXl3k4jApfY2Qp-7P0rzUDxL"
// }

/***************************************************************
  Local Login for form submissions
  @Params username (in body)
  @Params password (in body)
  ***************************************************************/
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

/***************************************************************
  Jwt Authentication to authenticate using header data
  Example Header Data =
  {
    Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJlYmVrYWgiLCJpYXQiOjE1MjAzNTEwNDYsImV4cCI6MTUyMDM1MTY0Nn0.fqUDuz72G8GJmWTVc4E2u6Aq5G7gdosOAEC2c3D9pvY
  }
  ***************************************************************/
passport.use('jwt-auth', new JwtStrategy(jwtStrategyOptions,
  function(jwt_payload, done_callback) {
    const user = {
      username: jwt_payload.username
    }
    if (!jwt_payload) {
      return done_callback (null, false);
    }
    if (jwt_payload.username === 'rebekah') {
      return done_callback (null, user);
    }
  }
));

/***************************************************************
  Google Login Strategy
  ***************************************************************/
// passport.use('google-login', new GoogleStrategy({
//     consumerKey: googleCred.client_id,
//     consumerSecret: googleCred.client_secret,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(token, tokenSecret, profile, done) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//       });
//   }
// ));

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
  console.log('Login Request = ' + JSON.stringify(user));
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
exports.jwtAuthenticated = passport.authenticate('jwt-auth');
// exports.googleAuthenticated = passport.authenticate('google-auth');
exports.passport = passport;
