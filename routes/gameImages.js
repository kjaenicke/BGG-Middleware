var cheerio = require('cheerio');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request){
  app.get('/gameImages', function(req, res){
    var id  = req.query.id || '';

    visitor.pageview("/gameImages").send();
    visitor.event("gameImages", id).send();

    if(!id){
      res.send('500', 'GameID not found');
      res.end();
      throw new Error('Empty gameID error');
    }
    else{
      var url = "http://boardgamegeek.com/images/boardgame/" + id;
      request(url, function(err, response, body){
        if(err){ throw err; }

        //remove some of the really shitty images...they all still kinda suck though
        var regex       = new RegExp('^(//cf.)');
        var avatarRegex = new RegExp('^((?!avatars).)*$');
        var images = [];

        $ = cheerio.load(body);
        $('#main_content .forum_table tr td img').each(function(index, image){
          var src = $(image).attr('src');

          if(regex.test(src) && avatarRegex.test(src)){
            src = 'http:' + src;
            images.push({ url: src });
          }
        });

        res.write(JSON.stringify(images));
        res.end();
      });
    }
  });
};
