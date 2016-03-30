var base = process.env.NODE_ENV !== 'production' ? 'http://bgg-middleware.herokuapp.com' : 'http://bgg-middleware.azurewebsites.net';
var auth = require("./AuthToken");

module.exports = {
    baseURL: base,
    headers: function(){
      if(process.env.NODE_ENV !== 'production'){
          return {};
      }

      return {
        'auth-token': auth
      };
    }
};
