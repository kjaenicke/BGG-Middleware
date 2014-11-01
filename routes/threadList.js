var _ = require('underscore-node');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  app.get('/threads', function(req, res){
    //get querystring params passed in
    var id  = req.query.id || -1;

    visitor.pageview("/threadList").send();
    visitor.event("threadList", id).send();

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
            res.send('500');
            res.end();
            throw new Error(e);
          }
        });
    }
  });
};
