var cheerio = require('cheerio');
var http = require('http');
var zlib = require('zlib');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request){
  app.get('/top100', function(req, res){
    visitor.pageview("/top100").send();
    try {
      var url = 'http://boardgamegeek.com/browse/boardgame';
      request(url, function(err, response, body){
        if(err){ throw err; }

        var games = [];

        $ = cheerio.load(body);
        $('#collectionitems tr td.collection_objectname a').each(function(index, gameLink){
          if($(gameLink).attr('href')){
            var idUrl = $(gameLink).attr('href');
            var id = parseInt(idUrl.substring(11, idUrl.lastIndexOf('/')), 10);

            games.push({
              id: id,
              name: $(gameLink).text()
            });
          }
        });

        res.write(JSON.stringify(games));
        res.end();
      });
    }
    catch (e){
      res.send('500');
      res.end();
      throw new Error(e);
    }
  });
};
