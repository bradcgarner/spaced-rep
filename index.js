'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const {DATABASE_URL, PORT, CLIENT_ORIGIN} = require('./config');

const app = express();

const { router: userRouter } = require('./users');
const { router: authRouter, basicStrategy, jwtStrategy } = require('./auth');
const passport = require('passport');
passport.use(basicStrategy);
passport.use(jwtStrategy);

app.use(
  morgan('common')
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);


// option below is to serve up html from the server, vs client
app.use(express.static('public'));
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html');
// });


app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

let server; // declare `server` here, then runServer assigns a value.

function dbConnect(url = DATABASE_URL) {
  return mongoose.connect(url, {useMongoClient: true})
    .catch(err => {
      console.error('Mongoose failed to connect');
      console.error(err);
    });
}

function runServer(port=PORT) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => { // always
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
      .on('error', err => {
        mongoose.disconnect();
        console.error('Express failed to start');
        reject(err);
      });
  });
}

// close the server, and return a promise. we'll handle the promise in integration tests.
function closeServer() {
  return mongoose.disconnect()
    .then(() => { // why no error catch here?
      return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      });
    });
}

// if called directly, vs 'required as module'
if (require.main === module) { // i.e. if server.js is called directly (so indirect calls, such as testing, don't run this)
  dbConnect();
  runServer().catch(err => console.error(err));
}

module.exports = {app, dbConnect, runServer, closeServer};
