var mail = require('../../tools/mail');

describe('test/tools/mail.test.js', function () {
  describe('sendActiveMail', function () {
    it('should ok', function () {
      mail.sendActiveMail('460873206@qq.com', 'token', 'hello iboatwww');
    });
  });

  describe('sendResetPassMail', function () {
    it('should ok', function () {
      mail.sendResetPassMail('460873206@qq.com', 'token', 'hello iboatwww');
    });
  });
});
mail.sendActiveMail('460873206@qq.com', 'token', 'hello iboatwww');
mail.sendResetPassMail('460873206@qq.com', 'token', 'hello iboatwww');
