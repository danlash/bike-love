var matcher = require('../lib/matcher');
var should = require('should');

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
