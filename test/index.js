/* global describe, it */
const should = require('should');
const checkdns = require('../');

describe('Require checkdns', function () {
  it('Checkdns ok', function () {
    should.exist(checkdns);
  });
  it('Has property nslookup', function () {
    checkdns.should.have.property('nslookup');
  });
  it('Has property nslookupFromFile', function () {
    checkdns.should.have.property('nslookupFromFile');
  });
});
