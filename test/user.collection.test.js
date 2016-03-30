var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var app      = require('../app');
var baseURL  = require('./baseURL');

describe('getting test users\'s collection', function(){
  describe('get unfiltered collection', function(){

    it('should return an array of games', function(done){
      request.get({ url: baseURL + '/user/collection?user=divdevtester' },
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
      request.get({ url: baseURL + '/user/collection?user=divdevtester&own=1' },
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
      request.get({ url: baseURL + '/user/collection?user=divdevtester&own=0' },
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
      request.get({ url: baseURL + '/user/collection?user=divdevtester&played=1' },
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
      request.get({ url: baseURL + '/user/collection?user=divdevtester&own=1&played=1' },
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
      request.get({ url: baseURL + '/user/collection?user=divdevtester&own=0&played=0' },
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
