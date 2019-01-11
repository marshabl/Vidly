const Joi = require('joi');
const config = require('config');
const debug = require('debug')('app:startup');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const genres = require('./routes/genres');
const home = require('./routes/home');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticator');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/vidly')
  .then(() => console.log('Connected to Mongodb'))
  .catch(err => console.error('Could not connect to Mongodb...'));


app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/', home);
app.use(logger);
app.use(authenticate);

console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
console.log('Mail Password: ' + config.get('mail.password'));

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
