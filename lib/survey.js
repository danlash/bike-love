var pg = require('pg');
var conString = process.env["HEROKU_POSTGRESQL_COPPER_URL"] || "postgres://danlash@localhost/bikelove";
var _ = require('underscore');

module.exports.save = function saveSurvey(id, introduction, questions, done){

  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }
    questions = questions || [];

    var remaining = 2 + questions.length, lastErr;
    function doneOne(){
      if (lastErr) { return; }
      if (--remaining === 0) { releaseClient(); return done(); }
    }
    function handleErr(err) {
      lastErr = err;
      releaseClient()
      return done(err);
    }

    var introSql = 'update survey set title = $2, text = $3 where id = $1';
    var introValues = [id, introduction.title, introduction.text];

    var introQuery = client.query(introSql, introValues);
    introQuery.on('end', doneOne);
    introQuery.on('error', handleErr);
    
    var clearQuestionsSql = 'delete from question where survey_id = $1';
    var clearQuery = client.query(clearQuestionsSql, [id]);
    clearQuery.on('end', doneOne);
    clearQuery.on('error', handleErr);

    questions.forEach(function(question){
      var questionSql = 'insert into question (survey_id, text, type, choices) values ($1, $2, $3, $4)';
      var questionValues = [id, question.text, question.type, (question.choices || []).join('|')];

      var questionQuery = client.query(questionSql, questionValues);
      questionQuery.on('end', doneOne);
      questionQuery.on('error', handleErr);
    });
    
  });  

};

module.exports.load = function loadSurvey(id, done){
  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }
    
    var remaining = 2, lastErr, survey = { questions: [] };
    function doneOne(){
      if (lastErr) { return; }
      if (--remaining === 0) { releaseClient(); return done(null, survey); }
    }
    function handleErr(err) {
      lastErr = err;
      releaseClient()
      return done(err);
    }

    var introSql = 'select * from survey where id = $1';
    var questionsSql = 'select * from question where survey_id = $1';

    var introQuery = client.query(introSql, [id]);
    introQuery.on('row', function(row){
      survey.title = row['title'];
      survey.text = row['text'];
      doneOne();
    });
    introQuery.on('error', handleErr);

    var questionsQuery = client.query(questionsSql, [id]);
    questionsQuery.on('row', function(row){
      survey.questions.push({ id: row['id'], text: row['text'], type: row['type'], choices: (row['choices'] || '').split('|') });
    });
    questionsQuery.on('end', doneOne);
    questionsQuery.on('error', handleErr);
  });
};

module.exports.answer = function(userId, questions, done){
  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }

    questions = questions || [];
    if (questions.length === 0) { releaseClient(); return done(); }

    var remaining = questions.length;
    function doneOne() {
      if (--remaining === 0) { releaseClient(); return done(); }
    }
    function handleErr(err) {
      lastErr = err;
      releaseClient()
      return done(err);
    }

    _.forEach(questions, function(question){
      var answerSql = 'insert into answer (participant_id, question_id, answer) values ($1, $2, $3)'
      var answerValues = [userId, question.question_id, question.answer];

      var answerQuery = client.query(answerSql, answerValues);  
      answerQuery.on('end', doneOne);
      answerQuery.on('error', handleErr);
    });
    
  });  
};
