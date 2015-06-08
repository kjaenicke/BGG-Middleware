var json = require('../../data/dailyGame.json');
var NodeCache = require( "node-cache" );
var _         = require('underscore-node');

//caching shib
var dailyGameCache = new NodeCache();

module.exports = function(app, request){
  app.get('/dailyGame', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){

      dailyGameCache.get('game', function( err, value ){
        if(!err && !_.isEmpty(value)){
          res.send(value.game);
          res.end();
        }
        else {
          var now = new Date();
          var start = new Date(now.getFullYear(), 0, 0);
          var diff = now - start;
          var oneDay = 1000 * 60 * 60 * 24;
          var day = Math.floor(diff / oneDay);

          //cache the announcements
          dailyGameCache.set('game', json[day], 86400, function( err, success ){
            if( !err && success ){
              console.log('Daily Game Cached...');
            }
          });

          if (json){
            res.write(JSON.stringify(json[day]));
            res.end();
          } else {
            res.status(500).send('Invalid JSON payload');
            res.end();
          }
        }
      });
    }
    else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
