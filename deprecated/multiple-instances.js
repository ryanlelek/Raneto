#!/usr/bin/env node

// This example mounts 2 raneto instances with different configurations in the same server

// Modules
import express from 'express';
import _debug from 'debug';
const debug = _debug('raneto');

// Here is where we load Raneto.
// When you are in your own project repository,
// Raneto should be installed via NPM and loaded as:
// import raneto from 'raneto';
//
// For development purposes, we load it this way in this example:
import raneto from '../app/index.js';

// Load our base configuration file.
import config from './config.default.js';

// Create two subapps with different configurations
const appEn = raneto(Object.assign({}, config, { base_url : '/en', locale : 'en', nowrap : true }));
const appEs = raneto(Object.assign({}, config, { base_url : '/es', locale : 'es', nowrap : true }));

// Create the main app
const mainApp = express();
mainApp.use('/en', appEn);
mainApp.use('/es', appEs);

// Load the HTTP Server
const server = mainApp.listen(appEn.get('port'), appEn.get('host'), function () {
  debug('Express HTTP server listening on port ' + server.address().port);
});

// Now you can navigate to both:
// - http://localhost:3000/en
// - http://localhost:3000/es
