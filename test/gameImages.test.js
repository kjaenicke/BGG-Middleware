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

//BASIC GAME ROUTE
describe('getting a games images', function(){
  it('should return multiple images', function(done){
    request.get({
      url: baseURL + '/gameImages?id=157354',
      headers: {
        'auth-token': auth.token
      }
    },
    function (err, res) {
      if(err) { throw err; }
      payload = JSON.parse(res.body);
      payload.should.be.instanceof(Array).and.have.lengthOf(15);
      done();
    });
  });

  it('should return valid image urls', function(done){
    request.get({
      url: baseURL + '/gameImages?id=157354',
      headers: {
        'auth-token': auth.token
      }
    },
    function (err, res) {
      if(err) { throw err; }
      payload = JSON.parse(res.body);
      payload[0].url.should.startWith('http://', 'URL does not start with http://');
      done();
    });
  });

  after(function(){
    server.close();
  });

});
