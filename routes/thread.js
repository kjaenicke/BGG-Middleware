var _ = require('underscore-node');

module.exports = function(app, request, parseString){
  app.get('/thread', function(req, res){
    //get querystring params passed in
    var id  = req.query.id || -1;

    if(id === -1){
      res.send('500', 'Thread ID not found');
      res.end();
      throw new Error('Empty thread id error');
    }
    else{
        request.get({
          url: 'http://boardgamegeek.com/xmlapi2/thread?id=' + id
        }, function(err, resp){
          try {
            parseString(resp.body, function(err, data){
              if(data){
                //create thread return object
                var thread = {
                  subject: data.thread.subject,
                  articles: []
                };

                //add the articles
                _.each(data.thread.articles[0].article, function(a){
                    thread.articles.push({
                      id: a.$.id,
                      username: a.$.username,
                      link: a.$.link,
                      postDate: a.$.postdate,
                      subject: a.subject[0],
                      body: a.body[0]
                    });
                });

                thread.articles = thread.articles.reverse();

                //send those bitches
                res.write(JSON.stringify(thread));
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
