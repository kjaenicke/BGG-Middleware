var express = require('express')
var app = express();
var request = require('request');

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
      url: 'http://www.boardgamegeek.com/xmlapi2/search?query="' + search + '"'
    }, function(error, response){
        if(!error){
          res.send('200', response.body);
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
