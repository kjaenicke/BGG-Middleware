var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var auth     = require("../utils/AuthToken");
var app      = require('../app');
var baseURL  = require('./baseURL');

describe('getting top 100 boardgames', function(){
  describe('get collection of 100 game objects', function(){
    it('should return collection of games', function(done){
      request.get({
        url: baseURL + '/top100',
        headers: {
          'auth-token': auth.token
        }
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.length.should.be.exactly(100);
        done();
      });
    });

    it('should return the thumbnail for the first image', function(){
      request.get({
        url: baseURL + '/top100',
        headers: {
          'auth-token': auth.token
        }
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload[0].thumbnail.length.should.be.instanceOf(String);
        done();
      });
    });
  });
});
