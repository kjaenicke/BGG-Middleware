var assert     = require("assert");
var request    = require("request");
var should     = require("should");
var app        = require('../app');
var server, portNum, baseURL;

before(function(){
  portNum = Math.floor((Math.random() * 3000) + 1) + 1024;
  baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:' + portNum : 'http://bgg-middleware.azurewebsites.net';
  server = app.listen(portNum);
});

describe('getting app equivalents', function(){
  describe('get apps', function(){

    it('should return a set of apps with iTunes equivalents', function(done){
      request.get({
        url: baseURL + '/apps'
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

  after(function(){
    server.close();
  });

});
