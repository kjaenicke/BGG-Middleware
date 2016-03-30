var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require('../utils/TestUtils');

describe('getting forum list', function(){
  describe('get forum list for game', function(){
        it('should return list of forums', function(done){
          request.get({
            url: TestUtils.baseURL + '/forumlist?id=9209',
            headers: TestUtils.headers()
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
            url: TestUtils.baseURL + '/threads?id=154',
            headers: TestUtils.headers()
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
            url: TestUtils.baseURL + '/thread?id=1203626',
            headers: TestUtils.headers()
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
            url: TestUtils.baseURL + '/thread?id=1203626',
            headers: TestUtils.headers()
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
            url: TestUtils.baseURL + '/thread?id=1203626',
            headers: TestUtils.headers()
          },
          function (err, res) {
            if(err) { throw err; }
            payload = JSON.parse(res.body);
            payload.articles.length.should.be.above(0);
            done();
          });
      });
    });

});
