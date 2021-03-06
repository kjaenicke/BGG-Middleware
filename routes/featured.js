//libs
var ent               = require('ent');
var StringComparison  = require('../utils/StringComparison');
var ua                = require('universal-analytics');
var visitor           = ua('UA-51022207-6');
var NodeCache         = require( "node-cache" );
var _                 = require('underscore-node');
//caching shib
var featuredGameCache = new NodeCache();

module.exports = function(app, request, parseString){
  app.get('/featured', function(req,res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //analytics
      visitor.pageview("/featured").send();

      //try to load game from cache
      featuredGameCache.get('featuredGame', function( err, value ){
        if(!err && !_.isEmpty(value)){
          res.send(value.featuredGame);
          res.end();
        }
        else {
          request.get({
              url: 'http://boardgamegeek.com/xmlapi/game/' + 164153 + '&comments=1&stats=1'
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
                        game.id = data.$.objectid;

                        //get primary title ??? terrible design...
                        for(var i = 0; i < data.name.length; i++){
                          if(data.name[i].$.primary){
                            game.title = data.name[i]._;
                            break;
                          }
                        }

                        //game description
                        if(data.description){
                          game.description = data.description[0];
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

                        //honor
                        if(data.boardgamehonor){
                          game.honor = [];
                          for (i = 0; i < data.boardgamehonor.length; i++){
                            game.honor.push(data.boardgamehonor[i]._ || '');
                          }
                        }

                        //publisher
                        if(data.boardgamepublisher){
                          game.publisher = [];
                          for (i = 0; i < data.boardgamepublisher.length; i++){
                            game.publisher.push(data.boardgamepublisher[i]._ || '');
                          }
                        }

                        //designer
                        if(data.boardgamedesigner){
                          game.designer = [];
                          for (i = 0; i < data.boardgamedesigner.length; i++){
                            game.designer.push(data.boardgamedesigner[i]._ || '');
                          }
                        }

                        //artist
                        if(data.boardgameartist){
                          game.artist = [];
                          for (i = 0; i < data.boardgameartist.length; i++){
                            game.artist.push(data.boardgameartist[i]._ || '');
                          }
                        }

                        //versions
                        if(data.boardgameversion){
                          game.versions = [];
                          for (i = 0; i < data.boardgameversion.length; i++){
                            game.versions.push({
                              'value' : data.boardgameversion[i]._ || '',
                              'id' : data.boardgameversion[i].$.objectid || ''
                            });
                          }
                        }

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

                        //categories
                        if(data.boardgamecategory){
                          game.category = [];
                          for (i = 0; i < data.boardgamecategory.length; i++){
                            game.category.push({
                              'value' : data.boardgamecategory[i]._ || '',
                              'id' : data.boardgamecategory[i].$.objectid || ''
                            });
                          }
                        }

                        //subdomains
                        if(data.boardgamesubdomain){
                          game.subdomain = [];
                          for (i = 0; i < data.boardgamesubdomain.length; i++){
                            game.subdomain.push({
                              'value' : data.boardgamesubdomain[i]._ || '',
                              'id' : data.boardgamesubdomain[i].$.objectid || ''
                            });
                          }
                        }

                        //families
                        if(data.boardgamefamily){
                          game.family = [];
                          for (i = 0; i < data.boardgamefamily.length; i++){
                            game.family.push({
                              'value' : data.boardgamefamily[i]._ || '',
                              'id' : data.boardgamefamily[i].$.objectid || ''
                            });
                          }
                        }

                        //expansion shit
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
                          var thumbURL = data.thumbnail[0] || '';
                          if (thumbURL.substring(0,2) === '//') {
                            thumbURL = "http:" + thumbURL;
                          }
                          game.thumbURL = thumbURL;
                        }

                        //comments
                        game.comments = [];

                        if(data.comment){
                          for(i = 0; i < data.comment.length; i++){
                            if(data.comment[i]._){
                              game.comments.push({
                                'text'   : data.comment[i]._,
                                'author' : data.comment[i].$.username || '',
                                'rating' : data.comment[i].$.rating || ''
                              });
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

                            if(data.statistics[s].ratings[0] || data.statistics[s].ratings[0].ranks){
                              for(var rankIndex = 0; rankIndex < data.statistics[s].ratings[0].ranks[0].rank.length; rankIndex++){
                                if(data.statistics[s].ratings[0].ranks[0].rank[rankIndex].$.name == 'boardgame'){
                                  game.boardGameRank = data.statistics[s].ratings[0].ranks[0].rank[rankIndex].$.value;
                                }
                              }
                            }
                          }
                        }

                        //cache the game
                        featuredGameCache.set('featuredGame', JSON.stringify(game), 86400, function( err, success ){
                          if( !err && success ){
                            console.log('Featured Game Cached...');
                          }
                        });

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
    }
    else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
