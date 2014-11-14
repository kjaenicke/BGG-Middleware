//libs
var _ = require('underscore-node');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  app.get('/user/plays', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
    //analytics
    visitor.pageview("/user/plays").send();

    //get querystring params passed in
    var username  = req.query.user || undefined;
    var id = req.query.id || -1;

    if(_.isUndefined(username)){
      res.status('500').write('Username not found');
      res.end();
    }
    else {
        var params = id !== -1 ? username + '&id=' + id : username;
        request.get({
          url: 'http://boardgamegeek.com/xmlapi2/plays?username=' + params
        }, function(err, resp){
          try {
            parseString(resp.body, function(err, data){
              if(data){
                var plays = {};
                var playsCollection = [];

                if(data.plays && data.plays.play){
                  //parse our results and find unique play counts
                  _.each(data.plays.play, function(play){
                    if(!plays.hasOwnProperty(play.item[0].$.objectid)){
                      plays[play.item[0].$.objectid] = {
                        count: 1,
                        name: play.item[0].$.name
                      };
                    }
                    else {
                      plays[play.item[0].$.objectid].count++;
                    }
                  });

                  //convert intermediate hastable to array for response paylod
                  _.each(_.keys(plays), function(key){
                    playsCollection.push({
                      id: key,
                      name: plays[key].name,
                      count: plays[key].count
                    });
                  });
                }

                //send those bitches
                res.write(JSON.stringify(playsCollection));
                res.end();
              }
            });
          }
          catch (e){
            res.send('500');
            res.end();
            throw new Error(e);
          }
        });
      }
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
