var ent = require('ent');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  app.get('/featured/image', function(req,res){
    visitor.pageview("/featured-image").send();
      request.get({
        url: 'http://boardgamegeek.com/xmlapi/game/' + 157354
      }, function(error, response){
          if(!error){
            try{
              //convert xml to json
              parseString(response.body, function (err, data){
                //reset data object because this is the only part we care about
                data = data.boardgames.boardgame[0];

                if(data){
                  if(data.thumbnail){
                    var thumbURL = data.thumbnail[0] || '';
                    if (thumbURL.substring(0,2) === '//') {
                      thumbURL = "http:" + thumbURL;
                    }
                    res.send(JSON.stringify({"thumbURL":thumbURL}));
                    res.end();
                  } else {
                    res.status(500).send('No thumbnail available.');
                    res.end();
                  }
                }
                else {
                  res.status(500).send('No game data available.');
                  res.end();
                }
              });
            }
            catch (err){
              res.status(500).send(err);
              res.end();
              throw new Error(err);
            }
          }
          else{
            res.status(500).send(e);
            res.end();
            throw new Error(error);
          }
      });
  });
};
