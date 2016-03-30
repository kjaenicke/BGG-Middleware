var assert     = require("assert");
var request    = require("request");
var should     = require("should");
var TestUtils = require('../utils/TestUtils');

describe('getting app equivalents', function(){
  describe('get apps', function(){

    it('should return a set of apps with iTunes equivalents', function(done){
      request.get({
        url: TestUtils.baseURL + '/apps',
        headers: TestUtils.headers()
      },
        function (err, res) {
          if(err) { throw err; }
          payload = JSON.parse(res.body);
          payload.should.be.instanceOf(Array);
          payload.length.should.be.above(0);
          done();
      });
    });
  });
});
