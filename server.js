#!/usr/bin/env node

// Modules
var debug = require('debug')('raneto');

// Here is where we load Raneto.
// When you are in your own project repository,
// Raneto should be installed via NPM and loaded as:
var raneto = require('./app/index.js');

// Then, we load our configuration file
// This can be done inline, with a JSON file,
// or with a Node.js module as we do below.
var config = require('./config/config.js');

// Finally, we initialize Raneto
// with our configuration object
var app = raneto(config);

// Load the HTTP Server
var server = app.listen(app.get('port'), app.get('host'), () => {
  debug(`Express HTTP server listening on port ${server.address().port}`);
});
