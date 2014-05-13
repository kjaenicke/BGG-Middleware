var express = require('express')
var app = express();
var request = require('request');
var parseString = require('xml2js').parseString;
var StringComparison = require('./StringComparison');

app.set('port', (process.env.PORT || 1337))
app.use(express.static(__dirname + '/public'))

app.get('/search', function(req, res) {
  //get querystring params passed in
  var search = req.query.searchTerms || '';

  if(!search){
    throw new Error('Empty search error');
    res.send('500', 'Search parameter not found');
    res.end();
  }
  else{
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

                    if(results[i].yearpublished && results[i].yearpublished.length > 0){
                      game.yearPublished = results[i].yearpublished[0].$.value || '';
                    }

                    if(game.title != undefined){
                      payload.games.push(game);
                    }

                    if(!(search == game.title)){
                      game.matchPercentage = (100 - (game.title.length - StringComparison.getEditDistance(search, game.title) / game.title.length));
                    }
                    else{
                      game.matchPercentage = 100;
                    }
                }

                payload.games.sort(function(a,b) {return (a.matchPercentage > b.matchPercentage) ? -1 : ((b.matchPercentage > a.matchPercentage) ? 1 : 0);}); 

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

app.listen(app.get('port'), function() {
  console.log("BGG API running at localhost:" + app.get('port'))
})
