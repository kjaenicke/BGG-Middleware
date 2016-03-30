var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var auth     = require("../utils/AuthToken");
var app      = require('../app');
var baseURL  = require('./baseURL');

describe('getting annoucements', function(){    
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
