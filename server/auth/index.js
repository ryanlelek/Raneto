'use strict';

var express = require('express');
var passport = require('passport');
var User = require('../user');

// Passport Configuration
require('./local/passport').setup(User);

var router = express.Router();

router.use('/local', require('./local'));

module.exports = router;
