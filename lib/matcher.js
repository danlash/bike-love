var _ = require('underscore');

module.exports.match = scorePeople;
module.exports.matchAll = scoreAllPeople;

function scorePeople(person1, person2){

  var matchScore = _.reduce(person1.answers, function(score, person1Answer){

    var person2Answer = _.find(person2.answers, function(person2Answer){ return person1Answer.question_id === person2Answer.question_id; });

    var matching = person1Answer.answer === person2Answer.answer;

    if (matching) { score += 1; }

    return score;
  }, 0);
  
  return matchScore;
}

function scoreAllPeople(people){
  _.each(people, function(person1){
    person1.matches = [];

    _.each(people, function(person2){
      if (person1.id === person2.id) { return; }

      var matchScore = scorePeople(person1, person2);

      person1.matches.push({
        matchScore: matchScore
      });
    });
  });

  _.each(people, function(person){
    person.matches = _.sortBy(person.matches, function(match) { return match.matchScore * -1; });
  });

  return people;
}