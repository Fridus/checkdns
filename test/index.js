var should = require('should');

describe('Require checkdns', function(){
  it('Checkdns ok', function(){
    var checkdns = require('../');
    should.exist(checkdns);
  })
  it('Has property nslookup', function(){
    var checkdns = require('../');
    checkdns.should.have.property('nslookup');
  })
  it('Has property nslookupFromFile', function(){
    var checkdns = require('../');
    checkdns.should.have.property('nslookupFromFile');
  })
})