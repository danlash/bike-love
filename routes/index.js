var express = require('express');
var router = express.Router();
var survey = require('../lib/survey');
var participants = require('../lib/participants');

router.get(['/', '/survey'], function(req, res, next) {
  var surveyId = 1;

  survey.load(surveyId, function(err, survey){
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

  participants.save(participant, function(err, savedUser){
    if (err) { return next(err); }

    var surveyId = 1;
    var userId = savedUser.id;
    var questions = req.body.questions;

    survey.answer(userId, questions, function(err){
      if (err) { return next(err); }

      res.redirect('/survey/complete');
    });
  });
});

module.exports = router;
