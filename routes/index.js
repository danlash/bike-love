var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var data = { title: 'Valentines 2015', intro: 'Atlanta is awesome.' };
  res.render('index', data);
});

router.get('/about', function(req, res) {
  res.render('about', { title: 'Express' });
});
module.exports = router;
