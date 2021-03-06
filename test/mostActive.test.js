var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require("../utils/TestUtils");

describe('getting most active games', function(){
  describe('get top 50 most active boardgames', function(){
    it('should return 50 games w/type of boardgame', function(done){
      request.get({
        url: TestUtils.baseURL + '/mostActive?type=\'boardgame\'',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.exactly(50);
        done();
      });
    });
  });

  describe('get top 50 most active videogames', function(){
    it('should return 50 games w/type of videogame', function(done){
      request.get({
        url: TestUtils.baseURL + '/mostActive?type=\'boardgame\'',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.exactly(50);
        done();
      });
    });
  });

  describe('get top 50 most active videogames', function(){
    it('should return the thumbnail of the first image', function(done){
      request.get({
        url: TestUtils.baseURL + '/mostActive',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload[0].thumbnail.should.be.instanceOf(String);
        done();
      });
    });
  });

});
