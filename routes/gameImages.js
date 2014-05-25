var cheerio = require('cheerio');

module.exports = function(app, request){
  app.get('/gameImages', function(req, res){
    var id  = req.query.id || '';

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
        var regex       = new RegExp('^(http|https)://');
        var avatarRegex = new RegExp('^((?!avatars).)*$');
        var images = [];

        $ = cheerio.load(body);
        $('#main_content .forum_table tr td img').each(function(index, image){
          var src = $(image).attr('src');
          if(regex.test(src) && avatarRegex.test(src)){
            images.push({ url: src });
          }
        });

        res.write(JSON.stringify(images));
        res.end();
      });
    }
  });
};