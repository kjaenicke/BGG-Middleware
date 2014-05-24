var assert   = require("assert");
var request  = require("request");
var should   = require("should");

describe('getting game details', function(){
  describe('get game\'s id', function(){
        it('should return a gameID', function(done){
          request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err) { throw err };
              payload = JSON.parse(res.body);
              assert.equal(9209, payload.id);
              done();
          });
      });
    });

    describe('get game title', function(){
        it('should return the game\'s title', function(done){
          request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
          function (err, res) {
            if(err){ throw err; }
            payload = JSON.parse(res.body);
            payload.title.length.should.be.above(0);
            done();
          });
        });
    });

    describe('get game description', function(){
          it('should return the game\'s description', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.description.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game comments', function(){
          it('should return the game\'s comments [25]', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              else{
                payload = JSON.parse(res.body);
                assert.equal(payload.comments.length, 25);
                done();
              }
            });
          });
    });

    describe('get game rating', function(){
          it('should return the game\'s rating', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              else{
                payload = JSON.parse(res.body);
                payload.rating.length.should.be.above(0);
                done();
              }
            });
          });
    });

    describe('get game yearPublished', function(){
          it('should return the game\'s year published', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.yearPublished.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game minPlayers', function(){
          it('should return the game\'s minPlayers', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.minPlayers.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game maxPlayers', function(){
          it('should return the game\'s maxPlayers', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.maxPlayers.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game playingTime', function(){
          it('should return the game\'s playingTime', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.playingTime.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game minAge', function(){
          it('should return the game\'s minAge', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.minAge.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game publisher', function(){
          it('should return the game\'s publisher', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.publisher.length.should.be.above(0);
              done();
            });
          });
    });

    describe('get game thumbURL', function(){
          it('should return the game\'s thumbURL', function(done){
            request.get({ url: 'http://powerful-cove-3241.herokuapp.com/game/details?id=9209' },
            function (err, res) {
              if(err){ throw err; }
              payload = JSON.parse(res.body);
              payload.thumbURL.length.should.be.above(0);
              done();
            });
          });
    });

});
