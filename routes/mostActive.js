var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  app.get('/mostActive', function(req, res){
    visitor.pageview("/mostActive").send();
    //get querystring params passed in
    var type  = req.query.type || 'boardgame';
    var limit = req.query.limit || -1;

    if(!type){
      res.send('500', 'Type not found');
      res.end();
      throw new Error('Empty type error');
    }
    else{
      request.get({
        url: 'http://boardgamegeek.com/xmlapi2/hot?type="' + type + '"'
      }, function(error, response){
          if(!error){
            try{
              var games = [];
              console.log(response.body);

              if (response.body !== undefined) {
                //convert xml to json
                parseString(response.body, function (err, data) {
                  console.log(data);
                  console.log(data.items);
                  if(data.items && data.items.item){
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

                        games.push(game);
                    }

                    //limit results if parameter exists
                    if(limit != -1){
                      games = games.slice(0, parseInt(limit, 10));
                    }

                  } else {
                    res.status(500).send('Invalid parseString response.');
                    res.end();
                  }

                  res.write(JSON.stringify(games));
                  res.end();
                });
              }
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
  });
};
