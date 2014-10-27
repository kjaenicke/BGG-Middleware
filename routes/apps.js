var json = require('../utils/AppEquivalents.json');

module.exports = function(app, request){
  app.get('/apps', function(req, res){

    if (json){
      res.write(JSON.stringify(json));
      res.end();
    } else {
      res.status(500).send('Invalid JSON payload');
      res.end();
    }

  });
};
