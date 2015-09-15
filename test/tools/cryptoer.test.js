var cryptoer = require('../../tools/cryptoer');
var should = require('should');

describe('test/tools/cryptoer.test.js', function () {
  it('should be equal', function () {
    var enc = cryptoer.aesEncrypt('123','key');
    var dec = cryptoer.aesDecrypt(enc,'key');
    dec.should.equal('123');
  });

  it('should be equal', function () {
    cryptoer.md5('123').should.equal('202cb962ac59075b964b07152d234b70');
  });
});
