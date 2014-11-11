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

describe('getting forum list', function(){
  describe('get forum list for game', function(){
        it('should return list of forums', function(done){
          request.get({
            url: baseURL + '/forumlist?id=9209',
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

    describe('get thread list for game', function(){
      it('should return a list of threads', function(done){
        request.get({
            url: baseURL + '/threads?id=154',
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

    describe('get thread for a game', function(){
      it('should return a thread', function(done){
        request.get({
            url: baseURL + '/thread?id=1203626',
            headers: {
              'auth-token': auth.token
            }
          },
          function (err, res) {
            if(err) { throw err; }
            payload = JSON.parse(res.body);
            payload.articles.length.should.be.above(0);
            done();
          });
      });
    });

    describe('get thread for a game', function(){
      it('thread should have a title', function(done){
        request.get({
            url: baseURL + '/thread?id=1203626',
            headers: {
              'auth-token': auth.token
            }
          },
          function (err, res) {
            if(err) { throw err; }
            payload = JSON.parse(res.body);
            payload.subject.length.should.be.above(0);
            done();
          });
      });
    });

    describe('get thread for a game', function(){
      it('thread should have articles', function(done){
        request.get({
            url: baseURL + '/thread?id=1203626',
            headers: {
              'auth-token': auth.token
            }
          },
          function (err, res) {
            if(err) { throw err; }
            payload = JSON.parse(res.body);
            payload.articles.length.should.be.above(0);
            done();
          });
      });
    });

  after(function(){
    server.close();
  });

});
