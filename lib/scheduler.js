var _ = require('underscore');

module.exports = Scheduler;

function Scheduler(rounds){
  this._rounds = rounds;
};

Scheduler.prototype.schedule = function(participants){
  //initialize schedule
  var schedule = { rounds: [] };
  for (var i = 0; i < this._rounds; i++) {
    schedule.rounds.push({ id: i, matches: [] });
  };

  //scheduled matches
  var participantCounter = 0, roundCounter = 0;

  while( notFinished(schedule, participants) ) {

    var participant = participants[participantCounter % participants.length];

    var nextMatch = participant.matches.shift();

    var round = schedule.rounds[roundCounter % schedule.rounds.length];

    round.matches.push(nextMatch);

    participantCounter++;
    roundCounter++;
  }

  return schedule;
};

function notFinished(schedule, participants) {
  for (var i = 0; i < schedule.rounds.length; i++) {
    var round = schedule.rounds[i];
    if (Math.floor(round.matches.length < participants.length / 2)) { return true; }
  };

  return false;
}