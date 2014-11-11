var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var auth     = require("../utils/AuthToken");

var baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:1337' : 'http://bgg-middleware.azurewebsites.net';

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
});
