var app = require('./app.js');
app.listen(app.get('port'), function() {
  console.log("BGG API running at :" + app.get('port'));
});
