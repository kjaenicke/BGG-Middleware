//libs
var _           = require('underscore-node');
var ua          = require('universal-analytics');
var visitor     = ua('UA-51022207-6');
var interpolate = require('interpolate');

module.exports = function(app, request, parseString){
  app.get('/user/collection', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      // analytics
      // visitor.pageview("/user/collection").send();

      //get querystring params passed in
      var username  = req.query.user || undefined;

      //get optional parameters
      var optionalParams = [];
        optionalParams['subtype'] = 'boardgame';
        //boolean params (0,1)
        optionalParams['own']   = req.query.own || undefined;
        optionalParams['rated'] = req.query.rated || undefined;
        optionalParams['played'] = req.query.played || undefined;
        optionalParams['trade'] = req.query.trade || undefined;
        optionalParams['want'] = req.query.want || undefined;
        optionalParams['wishlist'] = req.query.wishlist || undefined;
        optionalParams['preordered'] = req.query.preordered || undefined;
        optionalParams['wanttoplay'] = req.query.wanttoplay || undefined;
        optionalParams['wanttobuy'] = req.query.wanttobuy || undefined;
        optionalParams['prevowned'] = req.query.prevowned || undefined;
        optionalParams['hasparts'] = req.query.hasparts || undefined;
        optionalParams['wantparts'] = req.query.wantparts || undefined;
        //index params
        //(1-5)
        optionalParams['wishlistpriority'] = req.query.wishlistpriority || undefined;
        //(1-10)
        optionalParams['minrating'] = req.query.minrating || undefined;
        //(1-10)
        optionalParams['rating'] = req.query.rating || undefined;
        //(1-10)
        optionalParams['minbggrating'] = req.query.minbggrating || undefined;
        //(1-10)
        optionalParams['bggrating'] = req.query.bggrating || undefined;

      //filter and build string
      var additionalParams = '';
      for(var key in optionalParams){
        if(!_.isUndefined(optionalParams[key])){
          additionalParams += interpolate('&{key}={value}', {
            key: key,
            value: optionalParams[key]
          });
        }
      }

      if(username === undefined){
        res.send('500', 'Username not found');
        res.end();
        throw new Error('Error for \'user/collection\' route: Empty username error');
      }
      else{
          request.get({
            url: 'http://boardgamegeek.com/xmlapi2/collection?username=' + username + additionalParams,
          },
          function(err, resp){
              parseString(resp.body, function(err, data){
                if(data){
                  //send those bitches
                  console.log('http://boardgamegeek.com/xmlapi2/collection?username=' + username + additionalParams);

                  var collection = [];
                  if(data.items){
                    //build our collection from the resultset
                    data = _.each(data.items.item, function(item){
                      collection.push({
                        id: item.$.objectid,
                        name: item.name[0]._
                      });
                    });
                  }

                  res.write(JSON.stringify(collection));
                  res.end();
                }
              });
        });
      }
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
