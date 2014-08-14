var cheerio = require('cheerio');
var http = require('http');
var gunzip = require('zlib').createGunzip();

module.exports = function(app, request){
  app.get('/top100', function(req, response){
    try {
      var options = {
          host: 'boardgamegeek.com',
          path: '/browse/boardgame'
      };

      http.get(options, function(res) {
        var body = '';

        res.pipe(gunzip);

        gunzip.on('data', function (data) {
            body += data;
        });

        gunzip.on('end', function() {
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

          response.write(JSON.stringify(games));
          response.end();
        });
      });
    }
    catch (e){
    res.send('500');
    res.end();
    throw new Error(e);
    }
  });
};
