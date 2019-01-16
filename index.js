const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const debug = require('debug')('app:startup');
const express = require('express');
const app = express();
const helmet = require('helmet');
const morgan = require('morgan');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const logger = require('./middleware/logger');
const authenticate = require('./middleware/authenticator');
const mongoose = require('mongoose');

if (!config.get('jwtPrivateKey')) {
  console.error('Fatal Error: jwtPrivateKey is not defined.');
  process.exit(1);
}

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
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/', home);
app.use(logger);
app.use(authenticate);

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
};

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
