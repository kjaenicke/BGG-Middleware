var express = require('express')
var app = express();
var request = require('request');
var parseString = require('xml2js').parseString;
var StringComparison = require('./StringComparison');

app.set('port', (process.env.PORT || 1337))
app.use(express.static(__dirname + '/public'))


///////////////////////////////////////
//  BASIC TEXT SEARCH
///////////////////////////////////////
app.get('/search', function(req, res) {
  //get querystring params passed in
  var search             = req.query.searchTerms || '';
  var typeFilter         = req.query.filter || false;
  var limit              = req.query.limit || -1;

  if(!search){
    throw new Error('Empty search error');
    res.send('500', 'Search parameter not found');
    res.end();
  }
  else{
    // We might consider additional parameters like 'gametype' so that users can specify whether they are looking for board games, expansions, video games, etc.
    request.get({
      url: 'http://boardgamegeek.com/xmlapi2/search?query="' + search + '"'
    }, function(error, response){
        if(!error){
          try{
            var payload = { searchText: search, games: [], totalResults: 0 };

            //convert xml to json
            parseString(response.body, function (err, data) {
              if(data.items.item){
                var results = data.items.item;

                for(var i = 0; i < results.length; i++){
                    var game = {};
                    game.title = results[i].name[0].$.value || undefined;

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
                    if((game.title != undefined && typeFilter == false) || (typeFilter && (typeFilter == game.type))){
                      payload.games.push(game);
                    }

                    // Calculate search string likeness to results (le magics)
                    if(!(search == game.title)){
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
                payload.games.sort(function(a,b) {return (a.matchPercentage > b.matchPercentage) ? -1 : ((b.matchPercentage > a.matchPercentage) ? 1 : 0);});

                //limit results if parameter exists
                if(limit != -1){
                  payload.games = payload.games.slice(0, parseInt(limit));
                }

                //set total results
                payload.totalResults = payload.games.length;
              }

              res.write(JSON.stringify(payload));
              res.end();
            });
          }
          catch (e){
            throw new Error(e);
            res.send('500');
            res.end();
          }
        }
        else{
          throw new Error(error);
          res.send('500');
          res.end();
        }
    });
  }
});
///////////////////////////////////////
//  END BASIC TEXT SEARCH
///////////////////////////////////////

app.listen(app.get('port'), function() {
  console.log("BGG API running at localhost:" + app.get('port'))
})
