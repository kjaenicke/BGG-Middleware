var assert   = require("assert");
var request  = require("request");
var should   = require("should");

var baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:1337' : 'http://bgg-middleware.azurewebsites.net';

describe('getting test users\'s plays', function(){

  describe('get unfiltered plays', function(){

    it('should return an array of plays', function(done){
      request.get({ url: baseURL + '/user/plays?user=divdevtester' },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.should.be.instanceOf(Array);
        payload.length.should.be.above(0);
        done();
      });
    });
  });

  describe('get plays by id', function(){
    it('should return an array of plays', function(done){
      request.get({ url: baseURL + '/user/plays?user=divdevtester&id=91831' },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.should.be.instanceOf(Array);
        payload.length.should.be.exactly(1);
        done();
      });
    });
  });

  describe('get unknown game by id', function(){
    it('should return an empyt array', function(done){
      request.get({ url: baseURL + '/user/plays?user=divdevtester&id=100' },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.should.be.instanceOf(Array);
        payload.length.should.be.exactly(0);
        done();
      });
    });
  });

});
