var assert   = require("assert");
var request  = require("request");
var should   = require("should");

var baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:1337' : 'http://bgg-middleware.azurewebsites.net';

describe('getting most active games', function(){

  describe('get top 50 most active boardgames', function(){
        it('should return 50 games w/type of boardgame', function(done){
          request.get({ url: baseURL + '/mostActive?type=\'boardgame\'' },
            function (err, res) {
              if(err) { throw err; }
              payload = JSON.parse(res.body);
              payload.length.should.be.exactly(50);
              done();
            });
        });
    });

    describe('get top 50 most active videogames', function(){
            it('should return 50 games w/type of videogame', function(done){
              request.get({ url: baseURL + '/mostActive?type=\'videogame\'' },
                function (err, res) {
                  if(err) { throw err; }
                  payload = JSON.parse(res.body);
                  payload.length.should.be.exactly(50);
                  done();
            });
        });
    });
});
