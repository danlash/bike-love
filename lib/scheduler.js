var _ = require('underscore');

module.exports = Scheduler;

function Scheduler(rounds){
  this._rounds = rounds;
}

Scheduler.prototype.schedule = function(participants){
  //initialize schedule
  var schedule = { rounds: [] };
  for (var i = 0; i < this._rounds; i++) {
    schedule.rounds.push({ number: i+1, matches: [] });
  }

  //scheduled matches
  var participantCounter = 0, roundCounter = 0;
  while( canSchedule(schedule, participants) ) {

    //randomize each time for fairness
    if (participantCounter % participants.length === 0) shuffle(participants);

    var participant = participants[participantCounter % participants.length];

    var availableRound = null, nextMatch;
    while (!availableRound) {

      nextMatch = participant.matches.shift();
      if (!nextMatch) { console.log(participant.first_name, participant.last_name, 'out of matches'); break; }

      //find next available round
      for (var i = 0; i < this._rounds; i++, roundCounter++) {
        var checkingRound = schedule.rounds[roundCounter % schedule.rounds.length];

        if (!roundContainsEitherParticipant(checkingRound, nextMatch) && !matchAlreadyScheduled(schedule, nextMatch)) {
          availableRound = checkingRound;
          break;
        }
      }
    }

    if (availableRound) { availableRound.matches.push(nextMatch); }

    participantCounter++;
    roundCounter++;
  }

  _.each(schedule.rounds, function(round){
    var scheduled = _.clone(participants);
    _.each(round.matches, function(match){
      scheduled.splice(scheduled.indexOf(match.subject), 1);
      scheduled.splice(scheduled.indexOf(match.suitor), 1);
    });
    round.sittingOut = scheduled[0];
    round.matches = _.sortBy(round.matches, function(match){ return -1 * match.matchScore; });
  });

  return schedule;
};

function canSchedule(schedule, participants) {
  //at least one match to schedule
  var atLeastOneMatch = false;
  for (var i = 0; i < participants.length; i++) {
    if (participants[i].matches.length !== 0) { atLeastOneMatch = true; break; }
  };

  if (!atLeastOneMatch) { return false; }

  //theres a place for the match to go
  for (var i = 0; i < schedule.rounds.length; i++) {
    var round = schedule.rounds[i];
    if (Math.floor(round.matches.length < participants.length / 2)) { return true; }
  }

  return false;
}

function roundContainsEitherParticipant(checkingRound, nextMatch) {
  for (var i = 0; i < checkingRound.matches.length; i++) {
    var checkingMatch = checkingRound.matches[i];

    if (checkingMatch.subject.id === nextMatch.subject.id || 
        checkingMatch.subject.id === nextMatch.suitor.id || 
        checkingMatch.suitor.id  === nextMatch.subject.id || 
        checkingMatch.suitor.id  === nextMatch.suitor.id) {
      return true;
    }
  }

  return false;
}
var util= require('util')
function matchAlreadyScheduled(schedule, nextMatch) {
  var matchedTo = {};
  _.each(schedule.rounds, function(round){
    _.each(round.matches, function(match){

      matchedTo[match.subject.id] = matchedTo[match.subject.id] || []; 
      matchedTo[match.subject.id].push(match.suitor.id);

      matchedTo[match.suitor.id] = matchedTo[match.suitor.id] || []; 
      matchedTo[match.suitor.id].push(match.subject.id);
    });
  });

  return _.contains(matchedTo[nextMatch.subject.id], nextMatch.suitor.id);
}

//http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}