var express = require('express')
var app = express();
var request = require('request');
var parseString = require('xml2js').parseString;

app.set('port', (process.env.PORT || 1337))
app.use(express.static(__dirname + '/public'))

app.get('/search', function(req, res) {
  //get querystring params passed in
  var search = req.query.searchTerms || '';

  if(!search){
    throw new Error('Empty search error');
    res.send('500', 'Empty search parameter');
  }
  else{
    request.get({
      url: 'http://boardgamegeek.com/xmlapi2/search?query="' + search + '"'
    }, function(error, response){
        if(!error){
          //convert xml to json
          parseString(response.body, function (err, result) {
            var preFormattedItems = result.items.item;
            var formattedItems = [];

            for(var i = 0; i < preFormattedItems.length; i++){
                console.log(preFormattedItems[i]);

                formattedItems.push({
                  title: preFormattedItems[i].name[0].$.value,
                  yearPublished: preFormattedItems[i].yearpublished[0].$.value
                });
            }

            res.write(JSON.stringify(formattedItems));
            res.end();
          });
        }
        else{
          throw new Error('500', error);
        }
    });
  }
});

app.listen(app.get('port'), function() {
  console.log("BGG API running at localhost:" + app.get('port'))
})
