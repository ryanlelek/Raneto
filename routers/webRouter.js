
var express = require('express');
var site = require('../server/site');
var auth = require('../server/auth/auth.service');

var router = express.Router();

router.get('/active_account',site.activeEmail);
router.get('/reset_pass',site.showResetPass);
router.post('/reset_pass',site.resetPass);

//user
router.get('/login',site.showAuth);
router.post('/login',site.auth);

router.get('/updatePass',auth.loginRequired,site.showUp);
router.post('/updatePass',auth.loginRequired,site.updatePass);

router.post('/forgotPass',site.forgotPass);
router.post('/signup',site.signup);
router.get('/loginout',site.loginout);

module.exports = router;
