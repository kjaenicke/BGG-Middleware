var cheerio = require('cheerio');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request){
  app.get('/categories', function(req, res){
    visitor.pageview("/categories").send();
      var url = 'http://boardgamegeek.com/browse/boardgamecategory';
      request(url, function(err, response, body){
        if(err){ throw err; }

        var categories = [];

        $ = cheerio.load(body);
        $('#main_content .forum_table tr td a').each(function(index, categoryLink){
          if($(categoryLink).attr('href')){
            var idUrl = $(categoryLink).attr('href');
            var id = parseInt(idUrl.substring(19, idUrl.lastIndexOf('/')), 10);

            categories.push({
              id: id,
              name: $(categoryLink).text()
            });
          }
        });

        res.write(JSON.stringify(categories));
        res.end();

      });
  });
};
