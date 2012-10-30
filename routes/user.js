
/*
 * GET users listing.
 */

exports.list = function(req, res){
  console.log('YAHOOO: ' + req.data);
  res.send("respond with a resource");
};