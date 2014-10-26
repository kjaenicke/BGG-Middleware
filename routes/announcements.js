module.exports = function(app, request){
  app.get('/announcements', function(req, res){
    request.get({ url: 'http://kjaenicke.github.io/BGG_App/announcements.json'},
      function(error, response){
        if(!error && JSON.parse(response.body).lastUpdated !== undefined){
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
