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

    //weight sexual preference
  if (person1.sex && person2.sex && person1.sexPreference === person2.sex && person1.sex === person2.sexPreference) {
    totalScore += 100;
  }

  return totalScore;
}

function scoreAllPeople(people){
  //score
  _.each(people, function(person1){
    person1.matches = [];

    _.each(people, function(person2){
      if (person1.id === person2.id) { return; }

      var matchScore = scorePeople(person1, person2);

      person1.matches.push({
        subject: person1,
        suitor: person2,
        matchScore: matchScore
      });
    });

  });

  //sort
  _.each(people, function(person){
    person.matches = _.sortBy(person.matches, function(match) { return match.matchScore * -1; });
  });

  //rank
  _.each(people, function(person){
    var currentRank = 0, currentMatchScore = 1000000;

    for (var i = 0; i < person.matches.length; i++) {
      var match = person.matches[i];

      if (match.matchScore < currentMatchScore) { 
        currentRank++; 
        currentMatchScore = match.matchScore; 
      }

      match.rank = currentRank;
    };
  });

  return people;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}