var should = require('should');
var Scheduler = require('../lib/scheduler');
var util = require('util');
var _ = require('underscore');


describe('scheduling matches', function(){
  var rounds, schedule;
  var personA, personB, personC, personD;

  beforeEach(function(){
    personA = {}, personB = {}, personC = {}, personD = {};

    personA = _.extend(personA, { 
      id: 1, 
      matches: [ 
        { rank: 1, subject: personA, suitor: personB },
        { rank: 2, subject: personA, suitor: personC },
        { rank: 3, subject: personA, suitor: personD }
      ] 
    });

    personB = _.extend(personB, { 
      id: 2, 
      matches: [ 
        { rank: 1, subject: personB, suitor: personC },
        { rank: 1, subject: personB, suitor: personA },
        { rank: 2, subject: personB, suitor: personD }
      ] 
    });

    personC = _.extend(personC, { 
      id: 3, 
      matches: [ 
        { rank: 1, subject: personC, suitor: personA },
        { rank: 2, subject: personC, suitor: personB },
        { rank: 2, subject: personC, suitor: personD }
      ] 
    });

    personD = _.extend(personD, { 
      id: 4, 
      matches: [ 
        { rank: 1, subject: personD, suitor: personA },
        { rank: 2, subject: personD, suitor: personB },
        { rank: 3, subject: personD, suitor: personC }
      ] 
    });

    var matchedParticipants = [ personA, personB, personC, personD ];
    rounds = 3;

    var scheduler = new Scheduler(rounds);
    schedule = scheduler.schedule(matchedParticipants);
    //console.log(util.inspect(schedule, { depth: 5 } ));
  });

  it('creates corresponding number of rounds', function(){
    schedule.rounds.length.should.equal(rounds);
  });

  it('schedules the first persons highest ranked match in the first round', function(){
    schedule.rounds[0].matches[0].subject.should.equal(personA);
    schedule.rounds[0].matches[0].suitor.should.equal(personB);
  });

  it('schedules the second participants highest ranked match in the second round', function(){
    schedule.rounds[1].matches[0].subject.should.equal(personB);
    schedule.rounds[1].matches[0].suitor.should.equal(personC);
  });

});