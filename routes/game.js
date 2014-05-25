var ent = require('ent');
var StringComparison = require('../utils/StringComparison');

module.exports = function(app, request, parseString){
  //simple view
  app.get('/game', function(req, res){
    //get querystring params passed in
    var id  = req.query.id || '';

    if(!id){
      res.send('500', 'GameID not found');
      res.end();
      throw new Error('Empty gameID error');
    }
    else{
      request.get({
        url: 'http://boardgamegeek.com/xmlapi/game/' + id
      }, function(error, response){
          if(!error){
            try{
              var game = {};

              //convert xml to json
              parseString(response.body, function (err, data){
                //reset data object because this is the only part we care about
                data = data.boardgames.boardgame[0];

                if(data){
                  //gameID
                  game.id = id;

                  //get primary title ??? terrible design...
                  for(var i = 0; i < data.name.length; i++){
                    if(data.name[i].$.primary){
                      game.title = data.name[i]._;
                      break;
                    }
                  }

                  //game description
                  game.description = ent.decode(data.description[0].replace(/(<([^>]+)>)/ig,""));

                  //URL for game's image
                  game.thumbURL = data.thumbnail[0];

                  res.write(JSON.stringify(game));
                  res.end();
                }
                else {
                  res.send(JSON.stringify(game));
                  res.end();
                }
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
  });

  //detailed view
  app.get('/game/details', function(req,res){
    //get querystring params passed in
    var id  = req.query.id || '';

    if(!id){
      res.send('500', 'GameID not found');
      res.end();
      throw new Error('Empty gameID error');
    }
    else{
      request.get({
        url: 'http://boardgamegeek.com/xmlapi/game/' + id + '&comments=1&stats=1'
      }, function(error, response){
          if(!error){
            try{
              var game = {};
              //convert xml to json
              parseString(response.body, function (err, data){
                //reset data object because this is the only part we care about
                data = data.boardgames.boardgame[0];

                if(data){
                  //gameID
                  game.id = id;

                  //get primary title ??? terrible design...
                  for(var i = 0; i < data.name.length; i++){
                    if(data.name[i].$.primary){
                      game.title = data.name[i]._;
                      break;
                    }
                  }

                  //game description
                  if(data.description){
                    game.description = ent.decode(data.description[0].replace(/(<([^>]+)>)/ig,""));
                  }

                  //year published
                  if(data.yearpublished){
                    game.yearPublished = data.yearpublished[0] || '';
                  }

                  //min players
                  if(data.minplayers){
                    game.minPlayers = data.minplayers[0] || '';
                  }

                  //max players
                  if(data.maxplayers){
                    game.maxPlayers = data.maxplayers[0] || '';
                  }

                  //play time
                  if(data.playingtime){
                    game.playingTime = data.playingtime[0] || '';
                  }

                  //minAge
                  if(data.age){
                    game.minAge = data.age[0] || '';
                  }

                  //publisher
                  if(data.boardgamepublisher){
                    game.publisher = data.boardgamepublisher[0]._ || '';
                  }

                  game.expansions = [];
                  if(data.boardgameexpansion){
                    for(var x = 0; x < data.boardgameexpansion.length; x++){
                      var expansion = {
                        title: data.boardgameexpansion[x]._,
                        id: data.boardgameexpansion[x].$.objectid
                      };

                      // Calculate search string likeness to results (le magics)
                      if(game.title.length > expansion.title.length){
                        expansion.matchPercentage = (100 - (game.title.length - StringComparison.getEditDistance(expansion.title, game.title) / game.title.length));
                      }
                      else{
                        expansion.matchPercentage = (100 - (expansion.title.length - StringComparison.getEditDistance(expansion.title, game.title) / expansion.title.length));
                      }

                      game.expansions.push(expansion);

                    }
                  }

                  game.expansions.sort(function(a,b) {return (a.matchPercentage > b.matchPercentage) ? -1 : ((b.matchPercentage > a.matchPercentage) ? 1 : 0);});


                  //URL for game's image
                  if(data.thumbnail){
                    game.thumbURL = data.thumbnail[0] || '';
                  }

                  //comnts
                  game.comments = [];

                  if(data.comment){
                    for(var c = 0; c < data.comment.length; c++){
                      if(data.comment[c]._){
                        game.comments.push(data.comment[c]._);
                      }

                      if(parseInt(game.comments.length, 10) === 25)
                        break;
                    }
                  }

                  if(data.statistics){
                    for(var s = 0; s < data.statistics.length; s++){
                      if(data.statistics[s].ratings[0] || data.statistics[s].ratings[0].average[0]){
                        game.rating = data.statistics[s].ratings[0].average[0] || '';
                      }
                    }
                  }

                  if(data.statistics){
                    for(var r = 0; r < data.statistics.length; r++){
                      if(data.statistics[r].ratings[0] || data.statistics[r].ratings[0].ranks){
                          for(var rankIndex = 0; rankIndex < data.statistics[r].ratings[0].ranks[0].rank.length; rankIndex++){
                            if(data.statistics[r].ratings[0].ranks[0].rank[rankIndex].$.name == 'boardgame'){
                              game.boardGameRank = data.statistics[r].ratings[0].ranks[0].rank[rankIndex].$.value;
                            }
                          }
                        }
                      }
                    }

                  res.write(JSON.stringify(game));
                  res.end();
                }
                else {
                  res.send(JSON.stringify(game));
                  res.end();
                }
              });
            }
            catch (err){
              res.send('500', err);
              res.end();
              throw new Error(err);
            }
          }
          else{
            res.send('500', e);
            res.end();
            throw new Error(error);
          }
      });
    }
  });
};
