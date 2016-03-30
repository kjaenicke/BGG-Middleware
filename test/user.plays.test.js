var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require('../utils/TestUtils');

describe('getting test users\'s plays', function(){
  describe('get unfiltered plays', function(){

    it('should return an array of plays', function(done){
      request.get({
        url: TestUtils.baseURL + '/user/plays?user=divdevtester',
        headers: TestUtils.headers()
      },
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
