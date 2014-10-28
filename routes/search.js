var StringComparison = require('../utils/StringComparison');

module.exports = function(app, request, parseString) {
  app.get('/search', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //get querystring params passed in
      var search             = req.query.searchTerms || '';
      var typeFilter         = req.query.filter || false;
      var limit              = req.query.limit || -1;

      if(!search){
        res.send('500', 'Search parameter not found');
        res.end();
        throw new Error('Empty search error');
      }
      else{
        // We might consider additional parameters like 'gametype' so that users can specify whether they are looking for board games, expansions, video games, etc.
        request.get({
          url: 'http://boardgamegeek.com/xmlapi2/search?query="' + search + '"' + '&type=boardgame,boardgameexpansion,videogame'
        }, function(error, response){
            if(!error){
              try{
                var games = [];

                //convert xml to json
                parseString(response.body, function (err, data) {
                  if(data.items.item){
                    var results = data.items.item;

                    for(var i = 0; i < results.length; i++){
                        var game = {};
                        if(results[i].name && results[i].name[0] && results[i].name[0].$){
                          game.title = results[i].name[0].$.value || '';
                        }

                        // Year published
                        if(results[i].yearpublished && results[i].yearpublished.length > 0){
                          game.yearPublished = results[i].yearpublished[0].$.value || '';
                        }

                        // Game type
                        if(results[i].$.type && results[i].$.type.length > 0){
                          game.type = results[i].$.type || '';
                        }

                        // Game ID - CRUCIAL
                        if(results[i].$.id && results[i].$.id.length > 0){
                          game.id = results[i].$.id || '';
                        }

                        // Game Title
                        if((game.title !== undefined && typeFilter === false) || (typeFilter && (typeFilter == game.type))){
                          games.push(game);
                        }

                        // Calculate search string likeness to results (le magics)
                        if(search.toUpperCase() !== game.title.toUpperCase()){
                          if(game.title.length > search.length){
                            game.matchPercentage = (100 - (game.title.length - StringComparison.getEditDistance(search, game.title) / game.title.length));
                          }
                          else{
                            game.matchPercentage = (100 - (search.length - StringComparison.getEditDistance(search, game.title) / search.length));
                          }
                        }
                        else{
                          game.matchPercentage = 100;
                        }
                    }

                    //once we have the title likeness calculated, sort in descending order
                    games.sort(function(a,b) {return (a.matchPercentage > b.matchPercentage) ? -1 : ((b.matchPercentage > a.matchPercentage) ? 1 : 0);});

                    //limit results if parameter exists
                    if(limit != -1){
                      games = games.slice(0, parseInt(limit, 10));
                    }

                  }

                  res.write(JSON.stringify(games));
                  res.end();
                });
              }
              catch (e){
                res.send('500');
                res.end();
                throw new Error(e);
              }
            }
            else{
              res.send('500');
              res.end();
              throw new Error(error);
            }
        });
      }
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
