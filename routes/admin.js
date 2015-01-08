var express = require('express');
var router = express.Router();
var _ = require('underscore');
var survey = require('../lib/survey');
var db = require('../lib/database');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var admins = [
  { username: 'danlash@gmail.com', password: 'dan' },
  { username: 'jeffwisard@gmail.com', password: 'jeff' },
  { username: 'leah.courtland@gmail.com', password: 'leah' }
];

passport.use(new LocalStrategy(
  function(username, password, done) {
    var user = _.find(admins, function(user) { return user.username === username; });
    if (!user) { return done(null, false, { message: 'Unknown username.' }); }                  
    if (user.password !== password) { return done(null, false, { message: 'Incorrect password.' }); }
      
    return done(null, { username: username });    
  }
));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

var ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/admin/login');
};

router.get('/setup', ensureAuthenticated, function(req, res) {
  res.render('setup', { username: req.user.username });
});

router.post('/setup', ensureAuthenticated, function(req, res, next){
  var introduction = req.body.introduction;
  var questions = req.body.questions;

  survey.save(1, introduction, questions, function(err){
    if (err) { return next(err); }

    res.redirect('/');
  });
});

router.get('/event', ensureAuthenticated, function(req, res) {
  res.render('event', { username: req.user.username });
});

router.get('/login', function(req, res) {
  res.render('login', { title: 'Express' });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/admin/setup',
                                   failureRedirect: '/admin/login' }));
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/admin/login');
});

router.get('/create_database', ensureAuthenticated, function(req, res, next) {
  db.create(function(err){ 
    if (err) { return next(err); }  
    res.send('Database created.');
  });
});

module.exports = router;
