//libs
var _ = require('underscore-node');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');
var q = require('q');
var $ = require('cheerio');

module.exports = function(app, request, parseString){
  app.get('/user/plays', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //get querystring params passed in
      var username = String(req.query.user) || undefined;

      if(_.isUndefined(username)){
        res.status('500').write('Username not found');
        res.end();
      }
      else {
        var sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 1);
        var dateString = sixMonthsAgo.toISOString().slice(0,10).replace(/-/g,"-");

        request.get({
          url: 'http://boardgamegeek.com/xmlapi2/plays?mindate=' + dateString + '&username=' + username
        }, function(err, resp){
          try {
            parseString(resp.body, function(err, data){
              if(data){
                var plays = {};
                var totalPlays = 0;
                var playsCollection = [];

                //check to see if we have to queue up a paged approach
                //or we can just return the results because we have < 100 (1 page)
                var totalNumberOfPlays = parseInt(data.plays.$.total, 10);
                var numberOfPages = Math.ceil(totalNumberOfPlays / 100);

                //single page
                if (numberOfPages === 1) {
                  if (data.plays && data.plays.play) {
                    //parse our results and find unique play counts
                    _.each(data.plays.play, function (play) {
                      if (!plays.hasOwnProperty(play.item[0].$.objectid)) {
                        plays[play.item[0].$.objectid] = {
                          count: 1,
                          name: play.item[0].$.name
                        };
                      }
                      else {
                        plays[play.item[0].$.objectid].count += parseInt(play.$.quantity, 10);
                      }

                      totalPlays += parseInt(play.$.quantity, 10);
                    });

                    //convert intermediate hastable to array for response paylod
                    _.each(_.keys(plays), function (key) {
                      playsCollection.push({
                        id: key,
                        name: plays[key].name,
                        count: plays[key].count
                      });
                    });
                  }

                  var resultObj = {
                    totalResults: totalNumberOfPlays,
                    plays: playsCollection,
                    username: username,
                    userId: data.plays.$.userid
                  };

                  //send those bitches
                  res.write(JSON.stringify(resultObj));
                  res.end();
                }
                //multi-page
                else {
                  if (data.plays && data.plays.play) {
                    var fetchPlayPromises = [];
                    var aggregatedPlays = data.plays.play;

                    for(var i = 2; i <= numberOfPages; i++){
                      fetchPlayPromises.push(getUsersPlaysByPage(request, parseString, username, i));
                    }

                    q.all(fetchPlayPromises).then(function (results) {
                        results.forEach(function (result) {
                            _.each(result, function(play){
                                aggregatedPlays = aggregatedPlays.concat(result);
                            });
                        });

                       //parse our results and find unique play counts
                        _.each(aggregatedPlays, function (play) {
                          if (!plays.hasOwnProperty(play.item[0].$.objectid)) {
                            plays[play.item[0].$.objectid] = {
                              count: parseInt(play.$.quantity, 10),
                              name: play.item[0].$.name
                            };
                          }
                          else {
                            plays[play.item[0].$.objectid].count += parseInt(play.$.quantity, 10);
                          }

                          totalPlays += parseInt(play.$.quantity, 10);
                        });

                        //convert intermediate hastable to array for response paylod
                        _.each(_.keys(plays), function (key) {
                          playsCollection.push({
                            id: key,
                            name: plays[key].name,
                            count: plays[key].count
                          });
                        });

                        var resultObj = {
                          totalResults: totalPlays,
                          plays: playsCollection,
                          username: username,
                          userId: data.plays.$.userid
                        };

                        res.status(200).write(JSON.stringify(resultObj));
                        res.end();
                    });

                  }
                }
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
    }
    else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};

var getUsersPlaysByPage = function(request, parseString, username, pageNumber){
  var deferred = q.defer();

  request.get({
    url: 'http://boardgamegeek.com/xmlapi2/plays?username=' + username.toUpperCase() + '&page=' + pageNumber
  }, function(err, resp){
    try {
      parseString(resp.body, function(err, data){
          if (data && data.plays && data.plays.play){
            deferred.resolve(data.plays.play);
          }
      });
    }
    catch (e){
      deferred.resolve([]);
      throw new Error(e);
    }
  });

  return deferred.promise;
};
