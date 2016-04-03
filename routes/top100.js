var cheerio   = require('cheerio');
var http      = require('http');
var zlib      = require('zlib');
var _         = require('underscore-node');
var NodeCache = require( "node-cache" );
var ua        = require('universal-analytics');
var visitor   = ua('UA-51022207-6');
var fallback  = require('../data/top100.json');
var q         = require('q');

//caching shib
var gameCache = new NodeCache();

module.exports = function(app, request, parseString){
  app.get('/top100', function(req, res){
    visitor.pageview("/top100").send();

    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      try {
        //try to load top 100 from cache
        gameCache.get('top100', function( err, value ){
          if(!err && !_.isEmpty(value)){
            res.send(value.top100);
            res.end();
          }
          // wasn't cached or err'd when fetching from cache
          else {
            getTop100Games(request).then(function(games){
              if(games && games.length === 100){
                getTopGameImage(games[0].id, request, parseString).then(function(imageURL){
                  games[0].thumbnail = imageURL;

                  //cache && only if we have 100 results (so we don't cache garbage results)
                  gameCache.set('top100', JSON.stringify(games), 86400, function( err, success ){
                    if( !err && success ){
                      console.log('Top 100 Games Cached...');
                      res.send(JSON.stringify(games));
                      res.end();
                    }
                  });
                });
              }
            })
            .catch(function(e){
              console.log(e);
            });
          }
        });
      }
      catch (e){
        console.log(e);
        res.send('500');
        res.end();
      }
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};

var getTop100Games = function(request) {
  var deferred = q.defer();
  var url = 'http://boardgamegeek.com/browse/boardgame';

  request(url, function(err, response, body){
    //If request fails, we just send our fallback
    if(err){
      deferred.reject();
    }

    var games = [];

    $ = cheerio.load(body);

    $('#collectionitems tr td.collection_objectname a').each(function(index, gameLink){
      if($(gameLink).attr('href')){
        var idUrl = $(gameLink).attr('href');
        var id = parseInt(idUrl.substring(11, idUrl.lastIndexOf('/')), 10);

        var game = {
          id: id,
          name: $(gameLink).text()
        };

        //Grab the game image for the first game only
        if(index === 0){
          var thumbnailCell = $(gameLink).parent().parent().parent().find('.collection_thumbnail');
          var thumbnailSrc = $(thumbnailCell).find('img').attr('src');
        }

        games.push(game);
      }
    });

    deferred.resolve(games);
  });

  return deferred.promise;
};

var getTopGameImage = function(id, request, parseString){
  var deferred = q.defer();

  request.get({
    url: 'http://boardgamegeek.com/xmlapi/game/' + id
  }, function(error, response){
      if(!error){
        try {
          //convert xml to json
          parseString(response.body, function (err, data){
            //reset data object because this is the only part we care about
            data = data.boardgames.boardgame[0];

            if(data){
              //URL for game's image
              if(data.image){
                var imageURL = data.image[0] || '';

                if (imageURL.substring(0,2) === '//') {
                  imageURL = "http:" + imageURL;
                }

                deferred.resolve(imageURL);
              }
            }
          });
        }
        catch (e){
          throw new Error(e);
        }
      }
  });

  return deferred.promise;
};
