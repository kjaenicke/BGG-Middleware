var express = require('express');
var app = express();
var request = require('request');
var parseString = require('xml2js').parseString;

app.set('port', (process.env.PORT || 1337));
app.use(express.static(__dirname + '/public'));

//LOAD THEM ROUTES, BOYYYYYY
require('./routes/search')(app, request, parseString);
require('./routes/mostActive')(app, request, parseString);
require('./routes/game')(app, request, parseString);
require('./routes/gameImages')(app, request);

app.listen(app.get('port'), function() {
  console.log("BGG API running at localhost:" + app.get('port'));
});
