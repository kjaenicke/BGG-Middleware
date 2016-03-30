var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var app        = require('../app');
var baseURL  = require('./baseURL');

describe('getting test users\'s plays', function(){
  describe('get unfiltered plays', function(){

    it('should return an array of plays', function(done){
      request.get({ url: baseURL + '/user/plays?user=divdevtester' },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.should.be.instanceOf(Object);
        payload.plays.should.be.instanceOf(Array);
        payload.plays.length.should.be.above(0);
        done();
      });
    });
  });
});
