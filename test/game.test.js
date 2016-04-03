var assert   = require("assert");
var request  = require("request");
var should   = require("should");
var TestUtils = require("../utils/TestUtils");

//BASIC GAME ROUTE
describe('getting basic game', function(){
    it('should return a valid game', function(done){
      request.get({
        url: TestUtils.baseURL + '/game?id=9209',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);

        assert.equal(9209, payload.id);
        payload.title.length.should.be.above(0);
        payload.thumbURL.length.should.be.above(0);

        done();
    });
  });
});

//DETAILS ROUTE
describe('getting game details', function(){
    it('should return a valid game', function(done){
      request.get({
        url: TestUtils.baseURL + '/game/details?id=9209',
        headers: TestUtils.headers()
      },
      function (err, res) {
        if(err) { throw err; }
        payload = JSON.parse(res.body);

        assert.equal(9209, payload.id);
        payload.title.length.should.be.above(0);
        payload.description.length.should.be.above(0);
        assert.equal(payload.comments.length, 25);
        payload.rating.length.should.be.above(0);
        payload.yearPublished.length.should.be.above(0);
        payload.minPlayers.length.should.be.above(0);
        payload.maxPlayers.length.should.be.above(0);
        payload.playingTime.length.should.be.above(0);
        payload.minAge.length.should.be.above(0);
        payload.publisher.length.should.be.above(0);
        payload.thumbURL.length.should.be.above(0);
        payload.thumbURL.should.startWith('http://', 'URL does not start with http://');
        payload.boardGameRank.length.should.be.above(0);

        done();
    });
  });
});
