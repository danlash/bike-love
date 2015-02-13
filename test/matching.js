var matcher = require('../lib/matcher');
var should = require('should');
var util = require('util');

describe('matching people', function(){

  describe('with two of two matching answers', function(){

    var matchScore;
    
    beforeEach(function(){
      var person1 = { 
        id: 1,
          answers: [
            { question_id: 1, answer: 'aaye' },
            { question_id: 2, answer: 'beee' }
          ] 
        };
      var person2 = {
        id: 2,
          answers: [
            { question_id: 1, answer: 'aaye' },
            { question_id: 2, answer: 'beee' }
          ] 
        };

      matchScore = matcher.match(person1, person2);
    });    

    it('scores 2 points', function(){
      matchScore.should.equal(2);
    });
  });

  describe('with one of two matching answers', function(){
    var matchScore;
    
    beforeEach(function(){
      var person1 = { 
        id: 1,
          answers: [
            { question_id: 1, answer: 'aaye' },
            { question_id: 2, answer: 'beee' }
          ] 
        };
      var person2 = {
        id: 2,
          answers: [
            { question_id: 1, answer: 'aaye' },
            { question_id: 2, answer: 'seee' }
          ] 
        };

      matchScore = matcher.match(person1, person2);
    });    

    it('scores 1 point', function(){
      matchScore.should.equal(1);
    });
  });
  
});

describe('matching multiple people', function(){

  var person1, person2, person3;
  beforeEach(function(){
    person1 = { id: 1, answers: [ { question_id: 1, answer: 'hey' } ] };
    person2 = { id: 2, answers: [ { question_id: 1, answer: 'hey' } ] };
    person3 = { id: 3, answers: [ { question_id: 1, answer: 'hey' } ] };

    matcher.matchAll([person1, person2, person3]);
  });

  it('identifies each participant', function(){
    person1.matches[0].subject.should.equal(person1);
    should.exist(person1.matches[0].suitor);
  });

  it('matches against all other people', function(){
    person1.matches.length.should.equal(2);
    person2.matches.length.should.equal(2);
    person3.matches.length.should.equal(2);
  }); 

  it('creates matches', function(){
    person1.matches[0].should.have.property('matchScore');
  });

  describe('matches', function(){
    beforeEach(function(){
      person1 = { id: 1, answers: [ { question_id: 1, answer: 'yes' }, { question_id: 2, answer: 'yes' }, { question_id: 3, answer: 'no' } ] };
      person2 = { id: 2, answers: [ { question_id: 1, answer: 'yes' }, { question_id: 2, answer: 'yes' }, { question_id: 3, answer: 'sup' } ] }; 
      person3 = { id: 3, answers: [ { question_id: 1, answer: 'no' },  { question_id: 2, answer: 'yes' }, { question_id: 3, answer: 'sup' } ] }; 

      matcher.matchAll([person1, person2, person3]);
    }); 

    it('are sorted by score', function(){
      person1.matches[0].matchScore.should.be.greaterThan(person1.matches[1].matchScore);
      person2.matches[0].matchScore.should.be.greaterThan(person2.matches[1].matchScore - 1); //match scores are equal
      person3.matches[0].matchScore.should.be.greaterThan(person3.matches[1].matchScore);
    });

    it('are ranked by score', function(){
      person1.matches[0].rank.should.equal(1);
      person1.matches[1].rank.should.equal(2);

      person2.matches[0].rank.should.equal(1);
      person2.matches[0].rank.should.equal(1);
    });
  });

});

describe('scoring text based question', function() {

  var matchScore;
  beforeEach(function(){
    var person1 = { id: 1, answers: [ { question_id: 1, question_type: 'text', answer: 'one two three four' }, { question_id: 2, question_type: 'text', answer: 'four five' } ] };
    var person2 = { id: 2, answers: [ { question_id: 1, question_type: 'text', answer: 'one three' }, { question_id: 2, question_type: 'text', answer: 'six seven' } ] };

    matchScore = matcher.match(person1, person2);
  });

  it('scores based on number of words matching', function(){
    //question 1 match score: 2/4 + 1/2 = 0.5
      matchScore.should.equal(0.5);
  });
});

describe('matching gays', function(){
  var person1, person2, person3, person4, person5;

  beforeEach(function(){
    person1 = { id: 1, sex: 'Male', sexPreference: 'Female', answers: [ { question_id: 1, answer: 'hey' } ] };
    person2 = { id: 2, sex: 'Male', sexPreference: 'Male', answers: [ { question_id: 1, answer: 'hey' } ] };
    person3 = { id: 3, sex: 'Female', sexPreference: 'Male', answers: [ { question_id: 1, answer: 'hey' } ] };
    person4 = { id: 4, sex: 'Male', sexPreference: 'Male', answers: [ { question_id: 1, answer: 'special' } ] };
    person5 = { id: 5, sex: 'Female', sexPreference: 'Female', answers: [ { question_id: 1, answer: 'special' } ] };

    matcher.matchAll([person1, person2, person3, person4, person5]);
  });

  it('respects sexual preference', function(){
    //only available sex match
    person1.matches[0].suitor.should.equal(person3); 
    person2.matches[0].suitor.should.equal(person4); 
    person3.matches[0].suitor.should.equal(person1); 
    person4.matches[0].suitor.should.equal(person2);
    
    //no available sex match, highest match first
    person5.matches[0].suitor.should.equal(person4);

  });
});

describe('matching age bracket', function(){
  var person1, person2, person3, person4, person5;

  beforeEach(function(){
    person1 = { id: 1, ageBracket: '20-25', answers: [ { question_id: 1, answer: 'hey' }, { question_id: 2, answer: 'music' } ] };
    person2 = { id: 2, ageBracket: '26-30', answers: [ { question_id: 1, answer: 'hey' }, { question_id: 2, answer: 'music' } ] };
    person3 = { id: 3, ageBracket: '20-25', answers: [ { question_id: 1, answer: 'ho' }, { question_id: 2, answer: 'music' } ] };
    person4 = { id: 4, ageBracket: '20-25', answers: [ { question_id: 1, answer: 'hey' }, { question_id: 2, answer: 'music' } ] };
    person5 = { id: 5, ageBracket: '26-30', answers: [ { question_id: 1, answer: 'ho' }, { question_id: 2, answer: 'music' } ] };

    matcher.matchAll([person1, person2, person3, person4, person5]);
  });

  it('is boosted', function(){
    person1.matches[0].suitor.should.equal(person4); //all matching
    person1.matches[1].suitor.should.equal(person2); //matching 2, different age
    person1.matches[2].suitor.should.equal(person3); //1 matching, same age
    person1.matches[3].suitor.should.equal(person5); //1 matching, different age
  });
});