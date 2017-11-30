'use strict';
// endpoint is '/api/auth'


const express = require('express');
const router = express.Router();
const config = require('../config');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const createAuthToken = function (user) {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const basicAuth = passport.authenticate('basic', { session: false });
const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/login', basicAuth, (req, res) => {
  const authToken = createAuthToken(req.user.apiRepr());
  // console.log('authToken',authToken);
  const foundUser = req.user.apiRepr();
  // console.log('foundUser',foundUser);  
  foundUser.authToken = authToken;
  foundUser.question = req.user.questions[req.user.questionHead];
  // console.log('foundUser with autho', foundUser);
  res.json(foundUser);
});

router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});

module.exports = { router };
