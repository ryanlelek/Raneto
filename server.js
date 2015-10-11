#!/usr/bin/env node

'use strict';

// Modules
var debug = require('debug')('raneto');
var app   = require('./app.js');

// HTTP Server
var server = app.listen(app.get('port'), function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});
