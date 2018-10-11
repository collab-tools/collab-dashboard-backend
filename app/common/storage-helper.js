/* eslint-disable import/no-unresolved */
const dbAppFactory = require('collab-db-application');
const dbLogFactory = require('collab-db-logging');
const config = require('config');
/* eslint-enable import/no-unresolved */

let storageInstance = null;

module.exports = class storageHelper {
  constructor() {
    if (!storageInstance) {
      storageInstance = {
        app: dbAppFactory(config.get('app_database')),
        log: dbLogFactory(config.get('logging_database'))
      };
    }
    return storageInstance;
  }
}
