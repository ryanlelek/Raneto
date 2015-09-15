
var express = require('express');
var site = require('../server/site');
var auth = require('../server/auth/auth.service');

var router = express.Router();

router.get('*',auth.loginRequired,site.list);

module.exports = router;
