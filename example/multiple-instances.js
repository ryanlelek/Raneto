#!/usr/bin/env node

'use strict';

// This example mounts 2 raneto instances with different configurations in the same server

// Modules
const debug = require('debug')('raneto');

// Here is where we load Raneto.
// When you are in your own project repository,
// Raneto should be installed via NPM and loaded as:
// var raneto = require('raneto');
//
// For development purposes, we load it this way in this example:
const raneto = require('../app/index.js');

// Load our base configuration file.
const config = require('./config.default.js');

const express = require('express');

// Create two subapps with different configurations
const appEn = raneto(Object.assign({}, config, { base_url : '/en', locale : 'en' }));
const appEs = raneto(Object.assign({}, config, { base_url : '/es', locale : 'es' }));

// Create the main app
const mainApp = express();
mainApp.use('/en', appEn);
mainApp.use('/es', appEs);

// Load the HTTP Server
const server = mainApp.listen(3000, function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});

// Now navigate to http://localhost:3000/en and http://localhost:3000/es
