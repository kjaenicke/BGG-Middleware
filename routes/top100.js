<<<<<<< HEAD
var cheerio   = require('cheerio');
var http      = require('http');
var zlib      = require('zlib');
var _         = require('underscore-node');
var NodeCache = require( "node-cache" );
var ua        = require('universal-analytics');
var visitor   = ua('UA-51022207-6');

//caching shib
var gameCache = new NodeCache();

module.exports = function(app, request){
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
            var url = 'http://boardgamegeek.com/browse/boardgame';
            request(url, function(err, response, body){
              if(err){ throw err; }

              var games = [];

              $ = cheerio.load(body);
              $('#collectionitems tr td.collection_objectname a').each(function(index, gameLink){
                if($(gameLink).attr('href')){
                  var idUrl = $(gameLink).attr('href');
                  var id = parseInt(idUrl.substring(11, idUrl.lastIndexOf('/')), 10);

                  games.push({
                    id: id,
                    name: $(gameLink).text()
                  });
                }
              });

              //cache for 1 day
              gameCache.set('top100', JSON.stringify(games), 86400, function( err, success ){
                if( !err && success ){
                  console.log('Top 100 Games Cached...');
                }
              });

              res.write(JSON.stringify(games));
              res.end();

            });
          }
        });
      }
      catch (e){
        res.send('500');
        res.end();
        // throw new Error(e);
      }
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
