var express = require('express');
var router = express.Router();
var survey = require('../lib/survey');

/* GET home page. */
router.get('/', function(req, res, next) {
  survey.load(1, function(err, survey){
    if (err) { return next(err); }

    survey.questions.forEach(function(question){
      question.multiplechoice = question.type === 'multiplechoice';
      question.freeform = question.type === 'freeform';
    });

    res.render('index', survey);  
  });
  
});

module.exports = router;
