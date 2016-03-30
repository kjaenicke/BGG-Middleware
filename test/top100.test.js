var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require("../utils/TestUtils");

describe('getting top 100 boardgames', function(){
  describe('get collection of 100 game objects', function(){
    it('should return collection of games', function(done){
      request.get({
        url: TestUtils.baseURL + '/top100',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.exactly(100);
        done();
      });
    });

    it('should return the thumbnail for the first image', function(){
      request.get({
        url: TestUtils.baseURL + '/top100',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload[0].thumbnail.length.should.be.instanceOf(String);
        done();
      });
    });
  });
});
