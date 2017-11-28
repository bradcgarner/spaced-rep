'use strict';
// endpoint is /api/questions/

const express = require('express');
const router = express.Router();
const { Questions } = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
router.use(jsonParser);

router.get('/', (req, res) => {
  Questions
    .find()
    .then(questions => {
      res.status(200).json(questions);
    })
    .catch(error => {
      res.status(500).json({message: `Something went wrong... ${error}`});
    });
});