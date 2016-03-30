var cheerio = require('cheerio');

module.exports = function(html){
  if(html && typeof html === 'string'){
    var $ = cheerio.load('<div>');
    $('div').append(html);
    return $('div').text();
  }

  return '';
}
