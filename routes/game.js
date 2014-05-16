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
                    console.log(data.name[i]);
                    if(data.name[i].$.primary){
                      game.title = data.name[i]._;
                      break;
                    }
                  }

                  //game description
                  game.description = data.description[0];

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
                  console.log(data);
                  //gameID
                  game.id = id;

                  //get primary title ??? terrible design...
                  for(var i = 0; i < data.name.length; i++){
                    console.log(data.name[i]);
                    if(data.name[i].$.primary){
                      game.title = data.name[i]._;
                      break;
                    }
                  }

                  //game description
                  game.description = data.description[0];

                  //year published
                  game.yearPublished = data.yearpublished[0];

                  //min players
                  game.minPlayers = data.minplayers[0];

                  //max players
                  game.maxPlayers = data.maxplayers[0];

                  //play time
                  game.playingTime = data.playingtime[0];

                  //minAge
                  game.minAge = data.age[0];

                  //publisher
                  game.publisher = data.boardgamepublisher[0]._;

                  //add theses in later...perhaps
                  game.expansions = [];

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
};
