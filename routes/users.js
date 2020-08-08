var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');
const { JsonWebTokenError } = require('jsonwebtoken');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req,res) => { res.sendStatus(200); });
router.post('/login',cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if(err)
      return next(err);
    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'Login Unsuccessful!', err: info});
    }
    req.logIn(user, (err) => {
      if(err) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'Login Successful!', token: token});
    }); 
  }) (req,res,next);
});
router.get('/logout',cors.corsWithOptions, (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});
router.get('/facebook/token', passport.authenticate('facebook-token'), (req,res) => {
  if(req.user)
  {
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, token: token, status: 'You are successfully logged in!'});
  }
})


router.get('/checkJWTToken', cors.corsWithOptions, (req,res) => {
  passport.authenticate('jwt', {session: false}, (err,user,info) => {
    if(err)
      return next(err);

    if(!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});
    }
  }) (req,res);
})

module.exports = router;
