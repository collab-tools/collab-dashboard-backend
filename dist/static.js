'use strict';

var client_config = require('config').get('client_config');

module.exports = {
    getPublic: {
        auth: false,
        handler: {
            directory: {
                path: './',
                redirectToSlash: true
            }
        }
    },
    // app: {
    //     auth: false,
    //     handler:
    //         function(request, reply) {
    //           reply.view('Default.jsx')
    //         }

    // },
    images: {
        auth: false,
        handler: {
            file: function () {
                function file(request) {
                    return './assets/images/' + request.params.filename;
                }

                return file;
            }()
        }
    },
    index: {
        auth: false,
        handler: function () {
            function handler(request, reply) {
                // reply.view('index.html', {google_client_id: client_config.google_client_id, hostname: client_config.hostname}).state('config', JSON.stringify(client_config));
                reply.view('../assets/static/index.html');
            }

            return handler;
        }()
    }
};