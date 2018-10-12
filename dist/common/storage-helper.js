'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable import/no-unresolved */
var dbAppFactory = require('collab-db-application');
var dbLogFactory = require('collab-db-logging');
var config = require('config');
/* eslint-enable import/no-unresolved */

var storageInstance = null;

module.exports = function () {
  function storageHelper() {
    _classCallCheck(this, storageHelper);

    if (!storageInstance) {
      storageInstance = {
        app: dbAppFactory(config.get('app_database')),
        log: dbLogFactory(config.get('logging_database'))
      };
    }
    return storageInstance;
  }

  return storageHelper;
}();