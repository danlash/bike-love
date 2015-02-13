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
  while( notFinished(schedule, participants) ) {

    var participant = participants[participantCounter % participants.length];

    var availableRound = null, nextMatch;
    while (!availableRound) {

      nextMatch = participant.matches.shift();
      if (!nextMatch) { break; }

      //find next available round
      for (var i = 0; i < this._rounds; i++, roundCounter++) {
        var checkingRound = schedule.rounds[roundCounter % schedule.rounds.length];

        if (!roundContainsParticipants(checkingRound, nextMatch)) {
          availableRound = checkingRound;
          break;
        }
      }
    }

    if (availableRound) availableRound.matches.push(nextMatch);

    participantCounter++;
    roundCounter++;
  }

  return schedule;
};

function notFinished(schedule, participants) {
  for (var i = 0; i < schedule.rounds.length; i++) {
    var round = schedule.rounds[i];
    if (Math.floor(round.matches.length < participants.length / 2)) { return true; }
  }

  return false;
}

function roundContainsParticipants(checkingRound, nextMatch) {
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

