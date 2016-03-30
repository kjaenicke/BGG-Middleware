var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require('../utils/TestUtils');

describe('getting test users\'s collection', function(){
  describe('get unfiltered collection', function(){

    it('should return an array of games', function(done){
      request.get({
        url: TestUtils.baseURL + '/user/collection?user=divdevtester',
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

  describe('get owned games in collection', function(){

    it('should return an array of games', function(done){
      request.get({
        url: TestUtils.baseURL + '/user/collection?user=divdevtester&own=1',
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

  describe('get non-owned games in collection', function(){

    it('should return an array of games', function(done){
      request.get({
        url: TestUtils.baseURL + '/user/collection?user=divdevtester&own=0',
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

  describe('get played games in collection', function(){
    it('should return an array of games', function(done){
      request.get({
        url: baseURL + '/user/collection?user=divdevtester&played=1',
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

  describe('get played + owned games in collection', function(){

    it('should return an array of games', function(done){
      request.get({
        url: TestUtils.baseURL + '/user/collection?user=divdevtester&own=1&played=1',
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

  describe('get non-played + non-owned games in collection', function(){

    it('should return an array of games', function(done){
      request.get({
        url: TestUtils.baseURL + '/user/collection?user=divdevtester&own=0&played=0',
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
