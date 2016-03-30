var baseURL = process.env.NODE_ENV !== 'production' ? 'http://bgg-middleware.herokuapp.com' : 'http://bgg-middleware.azurewebsites.net';

module.exports = baseURL;
