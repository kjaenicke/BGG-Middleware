var assert   = require("assert");
var request  = require("request");
var should   = require("should");

var baseURL = process.env.NODE_ENV == 'dev' ? 'http://localhost:1337' : 'http://bgg-middleware.azurewebsites.net';

describe('getting featured boardgame', function(){

  describe('get featured game object', function(){
        it('should return a valid game object', function(done){
          request.get({ url: baseURL + '/featured' },
            function (err, res) {
              if(err) { throw err; }
              payload = JSON.parse(res.body);
              payload.id.length.should.be.above(0);
              done();
            });
        });
    });


});
