var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require("../utils/TestUtils");

describe('getting games collection for search', function(){
  describe('get games', function(){
    it('should return a games', function(done){
      request.get({
        url: TestUtils.baseURL + '/search?searchTerms=\'Ticket to Ride\'',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.above(0);
        done();
      });
    });
  });

  describe('get games by type', function(){
    it('should return video games [>2]', function(done){
      request.get({
        url: TestUtils.baseURL + '/search?searchTerms=\'Ticket to Ride\'&type=\'videogame\'',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.above(2);
        done();
      });
    });
  });

});
