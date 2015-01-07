var pg = require('pg');
var conString = "postgres://danlash@localhost/bikelove";


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
    
    var clearQuestionsSql = 'delete from question where surveyid = $1';
    var clearQuery = client.query(clearQuestionsSql, [id]);
    clearQuery.on('end', doneOne);
    clearQuery.on('error', handleErr);

    questions.forEach(function(question){
      var questionSql = 'insert into question (surveyid, text, type, choices) values ($1, $2, $3, $4)';
      var questionValues = [id, question.text, question.type, (question.choices || []).join('|')];

      var questionQuery = client.query(questionSql, questionValues);
      questionQuery.on('end', doneOne);
      questionQuery.on('error', handleErr);
    });
    
  });  

};