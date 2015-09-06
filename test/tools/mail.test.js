var mail = require('../../tools/mail');

describe('test/tools/mail.test.js', function () {
  describe('sendActiveMail', function () {
    console.log('..');
    mail.sendActiveMail('boatwww@icloud.com','token','noodles');
  });

  describe('sendResetPassMail', function () {
    mail.sendResetPassMail('boatwww@icloud.com','toke','noodles');
  });
});
