
var pg = require('pg');
var conString = process.env["HEROKU_POSTGRESQL_COPPER_URL"] || "postgres://danlash@localhost/bikelove"
var fs = require('fs');

module.exports.create = function(done){
  pg.connect(conString, function(err, client, releaseClient) {
    if(err) { return done(err); }
    var script = fs.readFileSync(__dirname + '/create_database.sql').toString();

    var query = client.query(script);
    query.on('end', function(){ releaseClient(); return done();});
    query.on('error', function(err){ releaseClient(); return done(err); });
  });
};
