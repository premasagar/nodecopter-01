
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'SVGCopter' });
};

exports.send = function(req, res) {
  // get params && call the drone
  console.log(req.body.svg);
}
