var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var auth     = require("../utils/AuthToken");

var app      = require('../app');
var server, portNum, baseURL;

before(function(){
  portNum = Math.floor((Math.random() * 3000) + 1) + 1024;
  baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:' + portNum : 'http://bgg-middleware.azurewebsites.net';
  server = app.listen(portNum);
});

describe('getting featured boardgame', function(){
  describe('get featured game object', function(){
    it('should return a valid game object', function(done){
      request.get({
        url: baseURL + '/featured',
        headers: {
          'auth-token': auth.token
        }
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
        url: baseURL + '/featured/image',
        headers: {
          'auth-token': auth.token
        }
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

  after(function(){
    server.close();
  });

});
