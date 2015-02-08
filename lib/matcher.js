var _ = require('underscore');

module.exports.match = function(person1, person2){

  var matchScore = _.reduce(person1.answers, function(score, person1Answer){

    var person2Answer = _.find(person2.answers, function(person2Answer){ return person1Answer.question_id === person2Answer.question_id; });

    var matching = person1Answer.answer === person2Answer.answer;

    if (matching) { score += 1; }

    return score;
  }, 0);
  
  return matchScore;
};