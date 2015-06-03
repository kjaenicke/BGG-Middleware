var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var app        = require('../app');
var server, portNum, baseURL;

before(function(){
  portNum = Math.floor((Math.random() * 3000) + 1) + 1024;
  baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:' + portNum : 'http://bgg-middleware.azurewebsites.net';
  server = app.listen(portNum);
});

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

  after(function(){
    server.close();
  });

});
