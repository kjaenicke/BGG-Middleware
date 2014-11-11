//libs
var ent = require('ent');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');
var NodeCache = require( "node-cache" );
var _         = require('underscore-node');
//caching shib
var featuredImageCache = new NodeCache();

module.exports = function(app, request, parseString){
  app.get('/featured/image', function(req,res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
    //analytics
    visitor.pageview("/featured-image").send();

    //try to load image from cache
    featuredImageCache.get('featuredImageURL', function( err, value ){
      if(!err && !_.isEmpty(value)){
        res.send(value.featuredImageURL);
        res.end();
      }
      else {
        request.get({
            url: 'http://boardgamegeek.com/xmlapi/game/' + 164153
          }, function(error, response){
              if(!error){
                try{
                  //convert xml to json
                  parseString(response.body, function (err, data){
                    //reset data object because this is the only part we care about
                    data = data.boardgames.boardgame[0];

                    if(data){
                      if(data.thumbnail){
                        var thumbURL = data.thumbnail[0] || '';
                        if (thumbURL.substring(0,2) === '//') {
                          thumbURL = "http:" + thumbURL;
                        }

                        //cache the announcements
                        featuredImageCache.set('featuredImageURL', JSON.stringify({ "thumbURL" : thumbURL }), 86400, function( err, success ){
                          if( !err && success ){
                            console.log('Featured Image Cached...');
                          }
                        });

                        res.send(JSON.stringify({ "thumbURL" : thumbURL }));
                        res.end();

                      } else {
                        res.status(500).send('No thumbnail available.');
                        res.end();
                      }
                    }
                    else {
                      res.status(500).send('No game data available.');
                      res.end();
                    }
                  });
                }
                catch (err){
                  res.status(500).send(err);
                  res.end();
                  throw new Error(err);
                }
              }
              else{
                res.status(500).send(e);
                res.end();
                throw new Error(error);
              }
          });
        }
      });
    }
    else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
