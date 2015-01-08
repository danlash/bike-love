var express = require('express');
var router = express.Router();
var survey = require('../lib/survey');
var participants = require('../lib/participants');

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

router.post('/survey/answer', function(req, res, next) {
  var participant = req.body.participant;
  var answers = req.body.answers;

  participants.save(participant, function(err, savedUser){
    if (err) { return next(err); }

    var surveyId = 1;
    var userId = savedUser.id;

    survey.answer(surveyId, userId, answers, function(err){
      if (err) { return next(err); }

      res.redirect('/survey/complete');
    });
  });
});

module.exports = router;
