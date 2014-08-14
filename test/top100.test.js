var assert   = require("assert");
var request  = require("request");
var should   = require("should");

var baseURL = process.env.NODE_ENV == 'dev' ? 'http://localhost:1337' : 'http://bgg-middleware.azurewebsites.net';

describe('getting top 100 boardgames', function(){

  describe('get collection of 100 game objects', function(){
        it('should return collection of games', function(done){
          request.get({ url: baseURL + '/top100' },
            function (err, res) {
              if(err) { throw err; }
              payload = JSON.parse(res.body);
              payload.length.should.be.exactly(100);
              done();
            });
        });
    });


});
