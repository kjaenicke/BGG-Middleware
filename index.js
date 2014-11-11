var express = require('express');
var app = express();
var request = require('request');
var parseString = require('xml2js').parseString;
var cors = require('cors');

var whitelist = [
  "http://bgg-middleware.azurewebsites.net",
  "http://bgg-middleware-staging.azurewebsites.net",
  "http://bgg-middleware-stage.azurewebsites.net"
];
var corsOptions = {
  origin: function(origin, callback){
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  allowedHeaders: [
    "auth-token"
  ]
};
app.use(cors());

// Analytics Setup
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');
visitor.pageview("/").send();

// Port Setup
app.set('port', (process.env.PORT || 1337));
app.use(express.static(__dirname + '/public'));

//LOAD THEM ROUTES, BOYYYYYY
require('./routes/search')(app, request, parseString);
require('./routes/mostActive')(app, request, parseString);
require('./routes/game')(app, request, parseString);
require('./routes/gameImages')(app, request);
require('./routes/forumlist')(app, request, parseString);
require('./routes/threadList')(app, request, parseString);
require('./routes/thread')(app, request, parseString);
require('./routes/mechanics')(app, request, parseString);
require('./routes/categories')(app, request);
require('./routes/featured')(app, request, parseString);
require('./routes/featured-image')(app, request, parseString);
require('./routes/top100')(app, request);
require('./routes/announcements')(app, request);
require('./routes/apps')(app, request);
//USER SPECIFIC ROUTES
require('./routes/user/collection')(app, request, parseString);

app.listen(app.get('port'), function() {
  console.log("BGG API running at :" + app.get('port'));
});
