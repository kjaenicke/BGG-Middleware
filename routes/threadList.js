var _ = require('underscore-node');

module.exports = function(app, request, parseString){
  app.get('/threads', function(req, res){
    //get querystring params passed in
    var id  = req.query.id || -1;

    if(id === -1){
      res.send('500', 'Forum ID not found');
      res.end();
      throw new Error('Empty forum id error');
    }
    else{
        request.get({
          url: 'http://boardgamegeek.com/xmlapi2/forum?id=' + id
        }, function(err, resp){
          try {
            parseString(resp.body, function(err, data){
              if(data){
                var threads = _.pluck(data.forum.threads[0].thread, '$');
                res.write(JSON.stringify(threads));
                res.end();
              }
            });
          }
          catch (e){
            throw new Error(e);
          }
        });
    }
  });
};
