var express = require('express');
var app = express();
var request = require('request');

app.set('port', (process.env.PORT || 1337));
app.use(express.static(__dirname + '/public'));

//LOAD THEM ROUTES, BOYYYYYY
require('./routes/search')(app, request);
require('./routes/mostActive')(app, request);

app.listen(app.get('port'), function() {
  console.log("BGG API running at localhost:" + app.get('port'));
});
