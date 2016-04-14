var StringComparison = require('../utils/StringComparison');
var ConvertHTMLtoString = require('../utils/ConvertHTMLtoString');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  //simple view
  app.get('/game', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //get querystring params passed in
      var id  = req.query.id || '';

      visitor.pageview("/game").send();
      visitor.event("game", id).send();

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
                    game.description = ConvertHTMLtoString(data.description[0]);

                    //URL for game's image
                    if(data.thumbnail){
                      var thumbURL = data.thumbnail[0] || '';
                      if (thumbURL.substring(0,2) === '//') {
                        thumbURL = "http:" + thumbURL;
                      }
                      game.thumbURL = thumbURL;
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

  //detailed view
  app.get('/game/details', function(req,res){
    // if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //get querystring params passed in
      var id  = req.query.id || '';

      visitor.pageview("/game/details").send();
      visitor.event("gameDetails", id).send();

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
                    //temporary
                    //game.raw = data;

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
                      game.description = ConvertHTMLtoString(data.description[0]);
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
                res.status('500').send(err);
                res.end();
                throw new Error(err);
              }
            }
            else{
              res.status('500').send(error);
              res.end();
            }
        });
      }
    // } else {
    //   res.status(401).write('Unauthorized');
    //   res.end();
    // }
  });

  app.get('/game/details/test', function(req, res){
    var json = {"id":"161936","title":"Pandemic Legacy: Season 1","description":"Pandemic Legacy is by design a non-replayable co-operative campaign game, with an overarching story-arc played through in 12-24 sessions, depending on how well your group does at the game. At the beginning, the game starts very similar to basic Pandemic, in which your team of disease-fighting specialists races against the clock to travel around the world, treating disease hotspots while researching cures for each of four plagues before they get out of hand.During a player\'s turn, they have four actions available, with which they may travel around in the world in various ways (sometimes needing to discard a card), build structures like research stations, treat diseases (removing one cube from the board; if all cubes of a color have been removed, the disease has been eradicated), trade cards with other players, or find a cure for a disease (requiring five cards of the same color to be discarded while at a research station). Each player has a unique role with special abilities to help them at these actions.After a player has taken their actions, they draw two cards. These cards can include epidemic cards, which will place new disease cubes on the board, and can lead to an outbreak, spreading disease cubes even further. Outbreaks additionally increase the panic level of a city, making that city more expensive to travel to.Each month in the game, you have two chances to achieve that month\'s objectives. If you succeed, you win and immediately move on to the next month. If you fail, you have a second chance, with more funding for beneficial event cards.During the campaign, new rules and components will be introduced. These will sometimes require you to permanently alter the components of the game; this includes writing on cards, ripping up cards, and placing permanent stickers on components. Your characters can gain new skills, or detrimental effects. A character can even be lost entirely, at which point it\'s no longer available for play.","yearPublished":"2015","minPlayers":"2","maxPlayers":"4","playingTime":"60","minAge":"13","honor":["2015 Golden Geek Best Innovative Board Game Nominee","2015 Golden Geek Best Innovative Board Game Winner","2015 Golden Geek Best Strategy Board Game Nominee","2015 Golden Geek Best Strategy Board Game Winner","2015 Golden Geek Best Thematic Board Game Nominee","2015 Golden Geek Best Thematic Board Game Winner","2015 Golden Geek Board Game of the Year Nominee","2015 Golden Geek Board Game of the Year Winner","2016 Goblin Magnifico Nominee"],"publisher":["Z-Man Games","Asterion Press","Devir","Filosofia Éditions","Hobby Japan","Jolly Thinkers","Lacerta","Lifestyle Boardgames Ltd"],"designer":["Rob Daviau","Matt Leacock"],"artist":["Chris Quilliams"],"versions":[{"value":"Brazilian first edition (red)","id":"303840"},{"value":"Chinese first edition (blue)","id":"305126"},{"value":"Chinese first edition (red)","id":"305125"},{"value":"Dutch first edition (blue)","id":"288883"},{"value":"Dutch first edition (red)","id":"291712"},{"value":"English first edition (blue)","id":"245176"},{"value":"English first edition (red)","id":"271616"},{"value":"French first edition (blue)","id":"271618"},{"value":"French first edition (red)","id":"271619"},{"value":"German first edition (blue)","id":"281594"},{"value":"German first edition (red)","id":"288127"},{"value":"Italian first edition (Blue)","id":"287566"},{"value":"Italian first edition (Red)","id":"287564"},{"value":"Japanese edition (red)","id":"285190"},{"value":"Polish first edition (blue)","id":"270734"},{"value":"Polish first edition (red)","id":"274875"},{"value":"Portuguese first edition (blue)","id":"296084"},{"value":"Russian first edition (blue)","id":"293194"},{"value":"Spanish first edition (blue)","id":"278089"},{"value":"Spanish first edition (red)","id":"278091"}],"mechanic":[{"value":"Action Point Allowance System","id":"2001"},{"value":"Co-operative Play","id":"2023"},{"value":"Hand Management","id":"2040"},{"value":"Point to Point Movement","id":"2078"},{"value":"Set Collection","id":"2004"},{"value":"Trading","id":"2008"},{"value":"Variable Player Powers","id":"2015"}],"category":[{"value":"Environmental","id":"1084"},{"value":"Medical","id":"2145"}],"subdomain":[{"value":"Strategy Games","id":"5497"},{"value":"Thematic Games","id":"5496"}],"family":[{"value":"Campaign Games","id":"24281"},{"value":"Legacy","id":"25404"},{"value":"Pandemic","id":"3430"}],"expansions":[],"thumbURL":"http://cf.geekdo-images.com/images/pic2452831_t.png","comments":[{"text":"Awesome game for a play through or two. Good successor to Risk Legacy. The linear plot & co-opness keep it from having the same heights, but it also has a very high floor. Recommended for everyone.\n\n-----\nBought ($92!), traded for Infiltration.","author":"-Johnny-","rating":"9"},{"text":"Tentative rating of 8 after 2 plays and still in Feb","author":"1000rpm","rating":"8"},{"text":"A fantastic spin on the traditional Pandemic experience. Without spoiling anything, there are a number of changes that occur throughout the game that I think give it a fresh enough experience that should give even the seasoned Pandemic player something new to tinker with (and that\'s well appreciated). In particular, I think the Legacy system is really well suited for this sort of endeavor and in the event of a sequel, I wouldn\'t hesitate to pick it up. If nothing else, to get 15-25 games out of a boardgame which ran about $55 isn\'t bad. The opportunity cost itself works out to a series of evenings which have wondrous and fresh experiences, even if they do seem familiar. This is one of the few games which really ventures into new territory without dropping the replay value considerably (e.g. TIME Stories).\n\nOn that note, there are some problems which I think exist here that Pandemic doesn\'t normally exhibit. First, we find that the game is sort of tied to a group of people so if you find yourself gaming with larger groups and different people each week/month/session then this becomes a much more difficult sell. Second, while the game\'s Legacy component does overcome some of my problems with how Pandemic became stale, ultimately this game will come to an end, and when it does, it\'s less attractive than normal Pandemic as the expansions aren\'t intended for this (but someone might be able to finagle it, who knows).  So while I do like this more than regular Pandemic (at this time rated a 6) for the exhilarating romp through a new disease evolution which is unlike most other games, ultimately it\'s going to end and fall over to the memory pile so I find it difficult to rate it a 9 or 10 when it\'s not expected to live past the number of iterations or time span that my other favorites have. Second, it\'s not a game I can suggest for just anyone, it requires a certain group to play (although, with the right group, one of the fall months can be super funny).  Finding a rating on BGG sort of implies some sort of replay-ability, and after 16 games of it, I\'m glad to be done. In that regard, I think P:L is a comfortable 7, maybe a strong 6.","author":"143245","rating":"7"},{"text":"The pinnacle of a board game experience.  You need this. \n","author":"1pecac","rating":"10"},{"text":"Same old boring Pandemic with some bling thrown on that coincidentally eliminates all replay value. I found the Legacy thing to be a lot more frustrating/annoying than fun. Gonna have a hard time finishing this one, and I can\'t wait to use it as target practice once I\'m finished with it (as you know you can\'t replay it after you finish it). ","author":"79strat","rating":"4"},{"text":"Josiah and Chris both rave about this--sounds like it\'d be a good time, but that 4 player limit is tough for my group.","author":"A Strange Aeon","rating":"N/A"},{"text":"I had a lot of fun playing this game. The story was great and I enjoyed the way the game evolved over time. \n\nI was frustrated by my own rules mistakes (many many) which began almost immediately and I never felt like I played a full game without mistakes. (In a normal game you would get these rules bloopers ironed out over time.) I was also frustrated by things that didn\'t seem as clear to me as I would have liked. \n\nI would still highly recommend the game, just pay super close attention to all the rules, especially the changes. ","author":"Aahz339","rating":"8"},{"text":"I don\'t like Pandemic, but I\'m a fan of Daviau\'s Risk: Legacy.","author":"aandjso","rating":"N/A"},{"text":"April 1st half (5 games in) - So far I have been enjoying it, but not to the \"best game ever\" level.  Rating = 8\nMay (7 games in) - I am liking this more.  Especially the permanence of some of the decisions and consequences.  Upgrades are often compelling decisions to make.  Rating = 9","author":"aaronph","rating":"9"},{"text":"Because all the people will be so mad.","author":"abbojm02","rating":"10"},{"text":"Played this game more times than any other one game.. disposable or not.. it is about fun.. this game is more fun than any other I own.. period. ","author":"abbojm03","rating":"10"},{"text":"Haters gonna hate. ","author":"abbojm05","rating":"10"},{"text":"Giving this one more than my rating for Pandemic.","author":"abrocker","rating":"N/A"},{"text":"EL formato legacy le sienta bien a pandemia, pero si no te gusta el juego base....","author":"abssalom","rating":"5"},{"text":"Game tells a very compelling tale.  Each win is celebrated and each loss is followed by a discussion of what went wrong and an urge to jump right back in.\n\nLoses one point because I probably will not replay once I complete the game.","author":"AbsZero","rating":"9"},{"text":"Not just my rating. My Pandemic Legacy team agrees that this game is a perfect 10.","author":"acedaryl1","rating":"10"},{"text":"O jogo é realmente viciante e muito maior do que o Pandemic. O sistema legacy é bom demais, mas é difícil não errar regras durante o jogo.","author":"AcemanBR","rating":"10"},{"text":"Unbalanced and too easy at 2. Fun although 3/4 of that is opening the chests/dossier. At the end of the day it\'s better than vanilla Pandemic, but it\'s still in that universe and I could care less about the theme. It is a good game, and a great experience. But I\'m not breaking down the door to continue our campaign ","author":"adamtattoo","rating":"7.5"},{"text":"Started out as a 10 in, say March or April, then my opinion cooled rapidly. Recommended if you like Pandemic to get worse as you play it. ","author":"admanwebb","rating":"6"},{"text":"Two plays in and so far, so good.  To make the most of the game, I am writing session reports about each of our plays.  You can read them [url=https://boardgamegeek.com/blogcategory/3750/pandemic-legacy]here[/url].  WARNING: Those reports are heavy on spoilers.\n\nSo far, it feels like base game Pandemic, but even within the first game it began to feel like a different beast.  Just knowing that decisions you make in one game will have lasting repercussions changes the way you think about and play the game.\n\nI\'m looking forward to finding out what happens next!","author":"AdmiralACF","rating":"9"},{"text":"https://boardgamegeek.com/thread/1492271/oh-what-year-spoiler-free-review-our-whole-pandemi","author":"AernoutMJC","rating":"10"},{"text":"Good with 2-4 players\n2.7 weight","author":"AgentDib","rating":"N/A"},{"text":"(No spoilers)\n\nI was so excited to see the Legacy system applied to a game that isn\'t Risk, and it\'s every bit as awesome as I\'d hoped.\n\nI don\'t yet know if there\'s replay value after the main sequence is complete, but after what just happened in our most recent game, I don\'t even care.  Pandemic Legacy has already given me tension, excitement, joy, and shock that I\'ve never felt in another game, and I\'m bumping it up from 9 to 10 as a result.  This is my third 10 ranking ever.\n\nUpdate:  We\'ve finished our season 1 play-through, and I\'m very confident in my 10 rating.  I don\'t expect to keep playing this copy, but it was so much fun that I\'m okay with that.  I recommend this game to everyone, and I\'ll buy season 2 without a second thought.","author":"AgentOddball","rating":"10"},{"text":"10/2015 - Purchased from CSI.\n\nTwo plays down with Kelly and we are having a blast.  Cannot wait to see what happens in February. ","author":"ahvanpelt","rating":"10"},{"text":"Played with 2, I guess it\'s better with 3/4 player\n+: Excellent play experience. You must try this\n-: rules for each mission should be a bit clearer\n\n","author":"Aior","rating":"8.2"}],"rating":"8.6285","boardGameRank":"1"};
    res.send(json);
    res.end();
  });
};
