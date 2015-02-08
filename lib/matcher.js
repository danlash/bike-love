var _ = require('underscore');

module.exports.match = scorePeople;
module.exports.matchAll = scoreAllPeople;

function scorePeople(person1, person2){

  var totalScore = _.reduce(person1.answers, function(allAnswersScore, person1Answer){

    var person2Answer = _.find(person2.answers, function(person2Answer){ return person1Answer.question_id === person2Answer.question_id; });

    var answerScore = 0;
    if (person1Answer.question_type === 'text') {

      var person1Words = person1Answer.answer.trim().replace(/\s+/gi, ' ').split(' ');
      var person2Words = person2Answer.answer.trim().replace(/\s+/gi, ' ').split(' ');

      var matchingWords = _.intersection(person1Words, person2Words);
      answerScore = round(matchingWords.length / person1Words.length, 1);

    } else { //mutliple choice
      
      var matching = person1Answer.answer === person2Answer.answer;
      if (matching) { answerScore = 1; }

    }

    return allAnswersScore + answerScore;
  }, 0);
  
  return totalScore;
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

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}