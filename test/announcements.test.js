var assert   = require("assert");
var request  = require("request");
var should   = require("should");

var baseURL = process.env.NODE_ENV == 'dev' ? 'http://localhost:1337' : 'http://bgg-middleware.azurewebsites.net';

describe('getting annoucements', function(){

  describe('get announcements', function(){

    it('should return a set of annnouncements', function(done){
      request.get({ url: baseURL + '/announcements' },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);
        payload.announcements.should.be.instanceOf(Array);
        payload.announcements.length.should.be.above(0);
        done();
      });
    });

    // it('should return a lastUpdated time', function(done){
    //   request.get({ url: baseURL + '/announcements' },
    //   function (err, res) {
    //     if(err) { throw err; }
    //     payload = JSON.parse(res.body);
    //     payload.lastUpdated.length.should.be.above(0);
    //     var temp = new Date(payload.lastUpdated);
    //     temp.should.be.instanceOf(Date);
    //     done();
    //   });
    // });

  });

});
