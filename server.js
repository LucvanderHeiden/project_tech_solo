// Setup of packages (requires)
const { generatePrimeSync } = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');
const methodOverride = require('method-override');
const { checkAuthenticated, checkNotAuthenticated } = require('./middleware/authentification');
const axios = require('axios');
require('dotenv').config();

const initializePassport = require('./passport');
const bcryptjs = require('bcryptjs');
initializePassport(
  passport,
  async (username) => {
    const userIsFound = await User.findOne({ username });
    return userIsFound;
  },
  async (id) => {
    const userIsFound = await User.findOne({ _id: id });
    return userIsFound;
  }
);

// IGDB API
const clientId = 'ofsypygkrdlh25ri7tozs0s779pfm7';
const clientSecret = 'lx5y6y7foc15y16fjzlnst3kfxlm44';

// Express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET_CODE,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Connect to MongoDB
const dbURI = process.env.DATABASE_URI;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => console.log('Connected to the database'))
  .catch((err) => console.log(err));

// Register view engine
app.set('view engine', 'ejs');

// Port
const port = process.env.PORT || 3000;

/*********************************************************************
Routes
***********************************************************************/

app.get('/', checkNotAuthenticated, (req, res) => {
  res.render('index');
});

let accessToken;

// Function to obtain the access token
async function getAccessToken() {
  try {
    const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Throw the error to be caught by the calling function
  }
}

app.get('/create', (req, res) => {
  const endpoint = '/games';
  const fields = 'name, cover.url';
  const limit = 30;
  const sort = 'rating:desc'; // Sort the games by rating in descending order
  const currentYear = new Date().getFullYear(); // Get the current year dynamically (so it's always up-to-date)
  const fiveYearsBack = currentYear - 5;
  const yearStart = new Date(`${fiveYearsBack}-01-01`).getTime() / 1000;
  const yearEnd = new Date(`${currentYear}-12-31`).getTime() / 1000;

  const headers = {
    'Client-ID': clientId,
    Authorization: `Bearer ${accessToken}`,
  };

  const body = `fields ${fields}; sort ${sort}; limit ${limit}; where rating > 0 & rating_count > 100 & (first_release_date >= ${yearStart} & first_release_date <= ${yearEnd} );`;
    
  console.log('Requesting games from the API...'); // Log a message before fetching games

  getAccessToken() // Call the function to retrieve the access token
    .then(() => {
      axios
        .post(`https://api.igdb.com/v4${endpoint}`, body, { headers })
        .then((response) => {
          const games = response.data;
          console.log('Received games from the API:', games); // Log the games data to the console

          res.render('create', { games });
        })
        .catch((error) => {
          console.error('Error:', error.message);
          res.status(500).send('An error occurred');
        });
    })
    .catch((error) => {
      console.error('Error:', error.message);
      res.status(500).send('An error occurred');
    });
});


// Dynamic profile page
app.get('/profile', checkAuthenticated, (req, res) => {
  res.render('profile', { user: req.user });
});

// Recover account page (Doesn't have any actual functionality)
app.get('/recover', (req, res) => {
  res.render('recover');
});

app.post('/', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/',
  failureFlash: true,
}));


app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

/* Error: 404 Page */
app.use((req, res) => {
  res.status(404).send('Error 404: file not found');
});

// Endpoint to obtain the access token
app.get('/access-token', (req, res) => {
  axios
    .post('https://id.twitch.tv/oauth2/token', null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      },
    })
    .then((response) => {
      const accessToken = response.data.access_token;

      // Making a request to the IGDB API
      axios
        .get('https://api.igdb.com/v4/games', {
          headers: {
            'Client-ID': clientId,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            fields: 'name,summary', 
            limit: 10, // Limit the number of games to 10
          },
        })
        .then((response) => {
          const games = response.data;
          res.json(games); // Send the games as a JSON response
        })
        .catch((error) => {
          console.error('Error:', error.message);
          res.status(500).send('An error occurred');
        });
    })
    .catch((error) => {
      console.error('Error:', error.message);
      res.status(500).send('An error occurred');
    });
});

// Start webserver
app.listen(port, '0.0.0.0', function () {
  console.log('Web server running on port 3000');
});
