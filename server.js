// Setup of packages (requires)
const { generatePrimeSync } =   require('crypto');
const express =                 require('express');
const mongoose =                require('mongoose');
const bodyParser =              require('body-parser')
const User =                    require('./models/user') 
const jwt =                     require('jsonwebtoken');
const req =                     require('express/lib/request');
const session =                 require('express-session');
const passport =                require('passport');
const flash =                   require('express-flash')
const methodOverride =          require('method-override')
const {checkAuthenticated, checkNotAuthenticated} = require('./middleware/authentification');
require('dotenv').config();

const initializePassport = require('./passport');
const bcryptjs = require('bcryptjs');
initializePassport(
    passport,
    async(username) => {
        const userIsFound = await User.findOne({ username })
        return userIsFound
    },
    async (id) => {
        const userIsFound = await User.findOne({ _id: id });
        return userIsFound;
    }
);

// Express app
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(flash());
app.use(session({
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
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to database'))             /* Console.log om te checken of er een succesvolle connectie met de database is */
    .catch((err) => console.log(err))

/* Register view engine */
app.set('view engine', 'ejs');          /* Bron gebruikt voor het opzetten van EJS: https://www.youtube.com/watch?v=yXEesONd_54 (The Net Ninja) */

// Port

const port = process.env.PORT || 3000;

/*********************************************************************
Routes 
***********************************************************************/

app.get('/', checkNotAuthenticated, (req, res) => {
    res.render('index');
});

app.get('/create', (req, res) => {
    res.render('create');
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
    failureFlash: true
}))

app.post('/create', checkNotAuthenticated, async (req, res) => {
    const userIsFound = await User.findOne({username: req.body.username})
    const emailIsFound = await User.findOne({email: req.body.email})

    if(userIsFound) {
        req.flash('error', 'Username has already been taken')
        res.redirect('/create');
    } else if(emailIsFound) {
        req.flash('error', 'Emailadress has already been taken')
        res.redirect('/create');
    } else {
        try {
            const passwordHash = await bcryptjs.hash(req.body.password, 10)
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                password: passwordHash,
                pc: req.body.pc,
                playstation: req.body.playstation,
                xbox: req.body.xbox,
                fortnite: req.body.fortnite,
                minecraft: req.body.minecraft,
                gta: req.body.gta,
                league: req.body.league,
                f1: req.body.f1,
                valorant: req.body.valorant,
                rl: req.body.rl,
                cod: req.body.cod,
                fifa: req.body.fifa,
                stardew: req.body.stardew
            })
            await user.save();
            res.redirect('/');
        } catch (error) {
            console.log(error);
        }
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

/* Error: 404 Page */
app.use( (req, res) => {
    res.status(404).send('Error 404: file not found')
})

/* Start webserver */
app.listen(port, "0.0.0.0", function() {
console.log("Web server running on port 3000");
})
