const Sequelize = require("sequelize");
const selectClause = { type: Sequelize.QueryTypes.SELECT };

const app = new Sequelize("collab", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
app
  .authenticate()
  .then(function(err) {
    console.log("App database connection has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database.");
  });

const log = new Sequelize("collab_logging", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
log
  .authenticate()
  .then(function(err) {
    console.log("Logging database connection has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database.");
  });

exports.sequelize = { app, log };
exports.selectClause = selectClause;
