var _ = require('underscore-node');
var ua = require('universal-analytics');
var visitor = ua('UA-51022207-6');

module.exports = function(app, request, parseString){
  app.get('/forumlist', function(req, res){
    if (process.env.NODE_ENV !== "production" || req.get('auth-token')===process.env.AUTH_TOKEN){
      //get querystring params passed in
      var id  = req.query.id || -1;

      if(id === -1){
        res.send('500', 'Game ID not found');
        res.end();
        throw new Error('Empty gameID error');
      }
      else{
        visitor.pageview("/forum-list").send();
        visitor.event("forum-list", id).send();
        request.get({
          url: 'http://boardgamegeek.com/xmlapi2/forumlist?id=' + id + '&type=thing'
        }, function(error, response){
            if(!error){
              try{
                //convert xml to json
                parseString(response.body, function (err, data) {
                  if(data){
                    //filter the xml to get the forum id's
                    var results = data.forums.forum;
                    results = _.pluck(results, '$');
                    res.write(JSON.stringify(results));
                    res.end();
                  }
                });
              }
              catch (e){
                res.send('500');
                res.end();
                throw new Error(e);
              }
            }
            else{
              res.send('500');
              res.end();
              throw new Error(error);
            }
        });
      }
    } else {
      res.status(401).write('Unauthorized');
      res.end();
    }
  });
};
