const Sequelize = require("sequelize");
const selectClause = { type: Sequelize.QueryTypes.SELECT };
const sequelize = new Sequelize("collab", "root", "", {
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

sequelize
  .authenticate()
  .then(function(err) {
    console.log("Connection has been established successfully.");
  })
  .catch(function(err) {
    console.log("Unable to connect to the database.");
  });

exports.sequelize = sequelize;
exports.selectClause = selectClause;
