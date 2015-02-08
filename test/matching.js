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