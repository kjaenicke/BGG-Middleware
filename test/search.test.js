var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var auth     = require("../utils/AuthToken");
var app        = require('../app');
var server, portNum, baseURL;

before(function(){
  portNum = Math.floor((Math.random() * 3000) + 1) + 1024;
  baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:' + portNum : 'http://bgg-middleware.azurewebsites.net';
  server = app.listen(portNum);
});

describe('getting games collection for search', function(){
  describe('get games', function(){
    it('should return a games', function(done){
      request.get({
        url: baseURL + '/search?searchTerms=\'Ticket to Ride\'',
        headers: {
          'auth-token': auth.token
        }
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
        url: baseURL + '/search?searchTerms=\'Ticket to Ride\'&type=\'videogame\'',
        headers: {
          'auth-token': auth.token
        }
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.above(2);
        done();
      });
    });
  });

  after(function(){
    server.close();
  });

});
