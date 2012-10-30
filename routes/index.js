
/*
 * GET home page.
 */

var fs = require('fs');

exports.index = function(req, res){
  fs.readFile('./public/index.html',  function(data){
    var output = data;
//
    res.header('Content-Type', 'text/html');
//    res.end('');


    res.render(data);

  });
    //fs.unlink('./public/index.html');
};