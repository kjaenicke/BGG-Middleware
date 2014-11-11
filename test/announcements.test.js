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

describe('getting annoucements', function(){
  describe('get announcements', function(){
    console.log('Running on port: ' + portNum);

    it('should return a set of annnouncements', function(done){
      request.get({
        url: baseURL + '/announcements',
        headers: {
          'auth-token': auth.token
        }
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
