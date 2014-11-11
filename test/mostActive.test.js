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

describe('getting most active games', function(){
  describe('get top 50 most active boardgames', function(){
    it('should return 50 games w/type of boardgame', function(done){
      request.get({
        url: baseURL + '/mostActive?type=\'boardgame\'',
        headers: {
          'auth-token': auth.token
        }
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
        url: baseURL + '/mostActive?type=\'videogame\'',
        headers: {
          'auth-token': auth.token
        }
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.exactly(50);
        done();
      });
    });
  });

  after(function(){
    server.close();
  });

});
