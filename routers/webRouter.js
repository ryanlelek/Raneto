
var express = require('express');
var site = require('../server/site');
var auth = require('../server/auth/auth.service');



var router = express.Router();

//router.get('/',auth.loginRequired,site.list);

router.get(['/','/list/*'],auth.loginRequired,site.list);

router.get('/active_account',site.activeEmail);//验证邮箱
router.get('/reset_pass',site.showResetPass);
router.post('/reset_pass',site.resetPass);

//user
router.get('/auth',site.showAuth);
router.post('/auth',site.auth); //login

router.get('/auth/updatePass',auth.loginRequired,site.showUp);
router.post('/auth/updatePass',auth.loginRequired,site.updatePass);

router.post('/auth/forgotPass',site.forgotPass);
router.post('/auth/signup',site.signup);
router.get('/auth/loginout',site.loginout);


module.exports = router;
