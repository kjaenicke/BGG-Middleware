var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require('../utils/TestUtils');

describe('getting featured boardgame', function(){
  describe('get featured game object', function(){
    it('should return a valid game object', function(done){
      request.get({
        url: TestUtils.baseURL + '/featured',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.id.length.should.be.above(0);
        done();
      });
    });
  });

  describe('get featured game image', function(){
    it('should return a valid game image URL', function(done){
      request.get({
        url: TestUtils.baseURL + '/featured/image',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.thumbURL.length.should.be.above(0, 'URL length not greater than 0');
        payload.thumbURL.should.startWith('http://', 'URL does not start with http://');
        done();
      });
    });
  });

});
