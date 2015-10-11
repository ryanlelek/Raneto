#!/usr/bin/env node

'use strict';

// Modules
var debug  = require('debug')('raneto');
var config = require('./config.js');
var app    = require('./app/index.js')(config);

// HTTP Server
var server = app.listen(app.get('port'), function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});
