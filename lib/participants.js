
var pg = require('pg');
var conString = "postgres://danlash@localhost/bikelove";


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