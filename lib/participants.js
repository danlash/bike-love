var _ = require('underscore');

var pg = require('pg');
var conString = process.env["HEROKU_POSTGRESQL_COPPER_URL"] || "postgres://danlash@localhost/bikelove"

module.exports.save = function saveParticipant(participant, done){

  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }

    var participantSql = 'insert into participant (first_name, last_name, email_address, age_bracket, gender, sexual_preference) values ($1, $2, $3, $4, $5, $6) returning id';
    var participantValues = [participant.first_name, participant.last_name, participant.email_address, participant.age_bracket, participant.gender, participant.sexual_preference];
    var participantQuery = client.query(participantSql, participantValues);

    participantQuery.on('row', function(row) { 
      releaseClient();
      participant.id = row.id; 
      return done(null, participant); 
    });
    participantQuery.on('error', function(err){ 
      releaseClient(); 
      return done(err); 
    });

  });
};

module.exports.getAllAnswers = function participantAnswers(done){

  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }

    var data = { questions: [], participants: {} };
    var remaining = 2;
    function doneOne(){
      if (--remaining === 0) { 
        releaseClient(); 
        data.participants = _.toArray(data.participants);
        return done(null, data); 
      }
    }

    var participantSql = 'select participant.id, participant.first_name, participant.last_name, participant.email_address, participant.age_bracket, participant.gender, participant.sexual_preference, answer.question_id, answer.answer from participant left join answer on participant.id = answer.participant_id order by participant.id asc, answer.question_id asc';
    var participantQuery = client.query(participantSql);

    participantQuery.on('row', function(row) { 
      data.participants[row.id] = data.participants[row.id] || {};

      var participant = data.participants[row.id];
      participant.id = row.id
      participant.first_name = row.first_name
      participant.last_name = row.last_name
      participant.email_address = row.email_address
      participant.age_bracket = row.age_bracket
      participant.gender = row.gender
      participant.sexual_preference = row.sexual_preference

      participant.answers = participant.answers || [];
      participant.answers.push(row.answer);
    });
    participantQuery.on('end', function(row) { 
      doneOne();
    });
    participantQuery.on('error', function(err){ 
      releaseClient(); 
      return done(err); 
    }); 

    var questionSql = 'select question.id, question.text from question order by id asc';
    var questionQuery = client.query(questionSql);

    questionQuery.on('row', function(row) { 
      data.questions.push(row);
    });
    questionQuery.on('end', function(row) { 
      doneOne();
    });
    questionQuery.on('error', function(err){ 
      releaseClient(); 
      return done(err); 
    });    
  });

};

module.exports.getAll = function allParticipants(done){

  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }

    var participants = [];

    var participantSql = 'select id, first_name, last_name, email_address from participant order by last_name asc';
    var participantQuery = client.query(participantSql);

    participantQuery.on('row', function(row) { 
      var participant = {};
      participant.id = row.id;
      participant.first_name = row.first_name;
      participant.last_name = row.last_name;
      participant.email_address = row.email_address;

      participants.push(participant);
    });
    participantQuery.on('end', function(row) { 
      releaseClient();
      return done(null, participants);
    });
    participantQuery.on('error', function(err){ 
      releaseClient(); 
      return done(err); 
    }); 

  });

};


module.exports.findAnswersByParticipantIds = function findAnswersByParticipantIds(participantIds, done){

  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }

    var participants = {};

    var participantIdsSql = "('"+participantIds.join("','")+"')";
    
    var participantSql = 'select participant.id, participant.first_name, participant.last_name, participant.email_address, participant.age_bracket, participant.gender, participant.sexual_preference, answer.question_id, answer.answer from participant left join answer on participant.id = answer.participant_id where participant.id in '+participantIdsSql+' order by participant.id asc, answer.question_id asc';
    var participantQuery = client.query(participantSql);

    participantQuery.on('row', function(row) { 
      participants[row.id] = participants[row.id] || {};

      var participant = participants[row.id];
      participant.id = row.id
      participant.first_name = row.first_name
      participant.last_name = row.last_name
      participant.email_address = row.email_address
      participant.age_bracket = row.age_bracket
      participant.gender = row.gender
      participant.sexual_preference = row.sexual_preference

      participant.answers = participant.answers || [];
      participant.answers.push({ question_id: row.question_id, answer: row.answer });
    });
    participantQuery.on('end', function(row) { 
      releaseClient();
      participants = _.toArray(participants);
      return done(null, participants);
    });
    participantQuery.on('error', function(err){ 
      releaseClient(); 
      return done(err); 
    }); 

  });


};

