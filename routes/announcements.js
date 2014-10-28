module.exports = function(app, request){
  app.get('/announcements', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      request.get({ url: 'http://kjaenicke.github.io/BGG_App/announcements.json'},
        function(error, response){
          if(!error){
            res.write(response.body);
            res.end();
          } else {
            res.status(500);
            res.end();
            throw new Error(error || 'Invalid response');
          }
      });
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
