// grab the nerd model we just created
var UserController = require('../users/userController.js');
var EventController = require('../events/eventController.js');
var passport       = require('passport');
var Strategy       = require('passport-facebook').Strategy;


module.exports = function(app) {

  // server routes ===========================================================
  // handle things like api calls
  // authentication routes

  //user routes
  app.get('/api/users', UserController.getUsers);

  app.get('/api/users/:fbId', UserController.getUserFriends);

  app.post('/api/users/removeEvent', UserController.removeEvent);

  app.post('/api/users', UserController.createOrFindOne);

  //event routes
  app.get('/api/events', EventController.allEvents);

  app.get('/api/events/:fbId', EventController.userEvents);

  app.post('/api/events/removeUser', EventController.removeUser);

  app.post('/api/events', EventController.newEvent);

  app.post('/api/events/submit', EventController.submitEventVotes);


  // route to handle creating goes here (app.post)
  // route to handle delete goes here (app.delete)

  // frontend routes =========================================================
  // route to handle all angular requests



  // passport routes =========================================================
  // route to handle all facebook passport requests

  app.get('/login/facebook',
    passport.authenticate('facebook', {scope: ['user_friends', 'email']}));

  app.get('/login/facebook/return', // this path is the callbackURL that matches the one stored in the auth.js
    passport.authenticate('facebook', { failureRedirect: '/' }),
    function(req, res) {
      //check users events and decide any passed deadline
      EventController.decideUsersEvents(req.user.id);

      //send cookie so client side has user info
      res.cookie('email', req.user.email);
      res.cookie('name',req.user.displayName);
      res.cookie('fbId',req.user.id);
      res.cookie('picture',req.user.photos[0].value);
      res.redirect('/#events');

    });


  app.get('/login',function(req, res){
    res.redirect('/#login');
  });

  // catch all route =========================================================
  // route to handle other things typed into the nav bar

  app.get('/*',function(req, res){
    res.redirect('/#events');
  });

  app.put('/api/events/:id', function(req, res) {
    var query = {_id: req.params.id};
    var updatedProps = req.body;
    var options = {new: true, upsert: true};
    User.findOneAndUpdate(query, updatedProps, options, function(err, response) {
      if (err) {
        return res.json(err);
      }
      res.json(response);
    });
  });
};
