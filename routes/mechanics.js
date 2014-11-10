var cheerio = require('cheerio');
var _ = require('underscore-node');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  app.get('/mechanics', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      visitor.pageview("/mechanics").send();
      var url = 'http://boardgamegeek.com/browse/boardgamemechanic';
      request(url, function(err, response, body){
        if(err){ throw err; }

          var mechanics = [];

          $ = cheerio.load(body);
          $('#main_content .forum_table tr td a').each(function(index, mechanicLink){
            if($(mechanicLink).attr('href')){
              var idUrl = $(mechanicLink).attr('href');
              var id = parseInt(idUrl.substring(19, idUrl.lastIndexOf('/')), 10);

              mechanics.push({
                id: id,
                name: $(mechanicLink).text()
              });
            }
          });

          res.write(JSON.stringify(mechanics));
          res.end();

        });
      } else {
        res.status(401).write('Unauthorized');
        res.end();
      }
    });

    app.get('/mechanic/game', function(req, res){
      if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
        visitor.pageview("/mechanics/game").send();
        var id          = req.query.id || '';
        var mechanic    = req.query.mechanic || '';
        var url         = 'http://localhost:1337/game/details?id=' + id;

        if(id === ''){
          res.send('500', 'Game ID not found for /mechanic/game');
          res.end();
          throw new Error('Empty game id error');
        }

        if(mechanic === ''){
          res.send('500', 'Mechanic ID not found for /mechanic/game');
          res.end();
          throw new Error('Empty mechanic id error');
        }

        request.get({
          url: 'http://boardgamegeek.com/xmlapi/game/' + id + '&comments=1&stats=1'
        }, function(error, response){
          try {
            var game = {};
            //convert xml to json
            parseString(response.body, function (err, data){
              //reset data object because this is the only part we care about
              data = data.boardgames.boardgame[0];

              //mechanics
              if(data.boardgamemechanic){
                game.mechanic = [];
                for (i = 0; i < data.boardgamemechanic.length; i++){
                  game.mechanic.push({
                    'value' : data.boardgamemechanic[i]._ || '',
                    'id' : data.boardgamemechanic[i].$.objectid || ''
                  });
                }
              }

              if(mechanic !== -1){
                //mechanics
                if(game.mechanic){
                  if(_.findWhere(game.mechanic, { id: String(mechanic) }) === undefined){
                    res.write(JSON.stringify({
                      hasMechanic: false
                    }));
                    res.end();
                  }
                  else {
                    res.write(JSON.stringify({
                      hasMechanic: true
                    }));
                    res.end();
                  }
                }
              }
              else {
                res.write(JSON.stringify({
                  hasMechanic: true
                }));
                res.end();
              }
            });
          }
          catch(e) {
            res.end('500', e);
            throw new Error(e);
          }
        });
      } else {
        res.status(401).write('Unauthorized');
        res.end();
      }
    });
  };
