var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request){
  app.get('/announcements', function(req, res){
    visitor.pageview("/announcements").send();
    request.get({ url: 'http://kjaenicke.github.io/BGG_App/announcements.json'},
      function(error, response){
        if(!error){
          res.write(response.body);
          res.end();
        } else {
          res.send('500');
          res.end();
          throw new Error(error || 'Invalid response');
        }
    });
  });
};
