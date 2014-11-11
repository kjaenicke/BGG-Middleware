//libs
var ua        = require('universal-analytics');
var visitor   = ua('UA-51022207-6');
var NodeCache = require( "node-cache" );
var _         = require('underscore-node');
//caching shib
var announcementsCache = new NodeCache();

module.exports = function(app, request){
  app.get('/announcements', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //analytics
      visitor.pageview("/announcements").send();

      //try to load announcements from cache
      announcementsCache.get('announcements', function( err, value ){
        if(!err && !_.isEmpty(value)){
          res.send(value.announcements);
          res.end();
        }
        else{
          request.get({ url: 'http://kjaenicke.github.io/BGG_App/announcements.json' },
            function(error, response){
              if(!error){

                //cache the announcements
                announcementsCache.set('announcements', response.body, 86400, function( err, success ){
                  if( !err && success ){
                    console.log('Announcements Cached...');
                  }
                });

                res.write(response.body);
                res.end();
              }
              else {
                res.status(500);
                res.end();
                throw new Error(error || 'Invalid response');
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
