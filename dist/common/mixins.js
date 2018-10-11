'use strict';

var _ = require('lodash');

// Convert sequelize database instances to JSON format for processing
function toJSON(instances) {
  return _.map(instances, function (instance) {
    return instance.toJSON();
  });
}

module.exports = function () {
  _.mixin({
    toJSON: toJSON
  });
};