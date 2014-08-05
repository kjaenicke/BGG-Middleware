var _ = require('underscore-node');

module.exports = function(app, request, parseString){
  app.get('/forums', function(req, res){
    //get querystring params passed in
    var id  = req.query.id || -1;
    var limit = req.query.limit || -1;

    if(id === -1){
      res.send('500', 'Game ID not found');
      res.end();
      throw new Error('Empty gameID error');
    }
    else{
      request.get({
        url: 'http://boardgamegeek.com/xmlapi2/forumlist?id=' + id + '&type=thing'
      }, function(error, response){
          if(!error){
            try{
              var forums = [];

              //convert xml to json
              parseString(response.body, function (err, data) {
                if(data){
                  //filter the xml to get the forum id's
                  var results = data.forums.forum;
                  results = _.pluck(results, '$');
                  var forumListIds = _.pluck(results, 'id');
                  getForums(forumListIds);
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
  });

  function getForums(forumListIds){
    _.each(forumListIds, function(id){
      //take the forumlist id's and get the forums associated with them
      request.get({
        url: 'http://boardgamegeek.com/xmlapi2/forum?id=' + id
      }, function(err, resp){
        try {
          parseString(resp.body, function(err, data){
            if(data){
              var threadObjects = _.pluck(data, 'threads');

              //console.log(threadObjects);

              var threads = [];
              _.each(threadObjects, function(t){
                if(t[0]){
                  threads.push(t[0]);
                }
              });

              threads = _.pluck(threads, 'thread');
              _.each(threads, function(th){
                  console.log(th[0]);
              });

              //getThreads(_.pluck(threads, 'id'));
            }
          });
        }
        catch (e){
          throw new Error(e);
        }
      });
    });
  }

  function getThreads(forumIds){
    _.each(forumIds, function(id){
      //take the forum id's and get the threads associated with them
      request.get({
        url: 'http://boardgamegeek.com/xmlapi2/thread?id=' + id
      }, function(err, resp){
        try {
          parseString(resp.body, function(err, data){
            if(data){
              var threads = _.pluck(data, '$');
              console.log(threads);
            }
          });
        }
        catch (e){
          res.send('500');
          res.end(e);
          throw new Error(e);
        }
      });
    });
  }
};
