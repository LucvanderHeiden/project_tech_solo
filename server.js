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
// const bcrypt = require('bcryptjs/dist/bcrypt');
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

// Constants voor env variables (Geheime codes waarvan we niet willen dat ze openbaar in de code te vinden zijn)
// const JWT_SECRET = process.env.JWT_SECRET_TOKEN;
// const IGDB_TOKEN = process.env.IGDB_SECRET_TOKEN; (WIP)

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
Middleware              Bron gebruikt voor het opzetten van EJS: https://www.youtube.com/watch?v=_GJKAs7A0_4 (The Net Ninja)
***********************************************************************/
// app.use(express.static('public'))
// app.use(bodyParser.json())
// app.use((req, res, next) => {
//     console.log('new request made: ');
//     console.log('host: ', req.hostname);
//     console.log('path: ', req.path);
//     console.log('method: ', req.method);
//     next();
// })
// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: true
// }));

// Passport.js setup
// app.use(passport.initialize());     /* Passport.js setup */
// app.use(passport.session());        /* Gebruik maken van session, zodat de gebruiker ingelogd kan blijven bijvoorbeeld over meerdere pagina's. */

// passport.serializeUser(function (user, done) {      /* Hiermee wordt de gebruiker (en data van de gebruiker) als het ware onthouden in de session */
//     done(null, user.id)
// })

// passport.deserializeUser(function (id, done) {      /* Hiermee kan de eerder genoemde data van de gebruiker opgehaald worden */
//     User.findById(id, function (err, user) {
//         done(err, user);
//     })
// })

// Onderstaande code checkt of de login gegevens kloppen en zoekt naar de bijbehorende gebruiker. Bij fouten worden errors gegeven.
// passport.use(new localStrat(function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//         if (err) return done(err);
//         if (!user) return done(null, false, { message: 'Incorrect username.' });

//         bcrypt.compare(password, user.password, function (err, res) {
//             if (err) return done(err);
//             if (res === false) return done(null, false, { message: 'Incorrect password.' });

//             return done(null, user)
//         })
//     })
// }))


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

    if(userIsFound) {
        req.flash('error', 'Username has already been taken')
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
                xbox: req.body.xbox
                // fortnite: fortnite,
                // minecraft: minecraft,
                // gta: gta,
                // league: league,
                // f1: f1,
                // valorant: valorant,
                // rl: rl,
                // cod: cod,
                // fifa: fifa,
                // stardew: stardew
            })
            await user.save();
            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.redirect('/create');
        }
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})
// Test login page thing (Might need to be deleted.)
// app.post('/login', passport.authenticate('local', {
//     successRedirect: '/profile',
//     failureRedirect: '/profile'
// }));


// app.post('/api/login', async (req, res) => {
//     const { username, password } = req.body
//     const user = await User.findOne({ username }).lean()          /* Door .lean toe te voegen geef je aan dat je niet alle extra informatie eromheen nodig hebt.*/

//     if(!user) {
//         return res.json({ status: 'error', error: 'Invalid login credentials' })        /* Error message wanneer iemand een ongeldige username/password combinatie invoert */
//     }
    
//     if(await bcrypt.compare(password, user.password)) {             /* Checken of de combinatie van username en password klopt. */
        
//         const token = jwt.sign({ 
//             id: user._id, 
//             username: user.username 
//         }, JWT_SECRET)
    
//         return res.json({ status: 'ok', data: token })
//     }

//     res.json({ status: 'error', data: 'Invalid login credentials' })
// })

// app.post('/api/register', async (req, res) => {
//     const {username, email, password: plainTextPassword, pc, playstation, xbox, fortnite, minecraft, gta, league, f1, valorant, rl, cod, fifa, stardew} = req.body

//     // Foutmeldingen bij het niet of verkeerd invoeren van velden
//     if(!username || typeof username !== 'string') {
//         return res.json({ status: 'error', error: 'Invalid username'})
//     }

//     if(!email || typeof email !== 'string') {
//         return res.json({ status: 'error', error: 'Invalid email'})
//     }

//     if(!plainTextPassword || typeof plainTextPassword !== 'string') {
//         return res.json({ status: 'error', error: 'Invalid password'})
//     }

//     // Foutmelding bij een te korte wachtwoord
//     if(plainTextPassword.length < 4) {
//         return res.json({ status: 'error', error: 'Password too short, password must be at least 5 characters.'})

//     }
//     const password = await bcrypt.hash(plainTextPassword, 10)

//     try {
//         const response = await User.create({
//         username,
//         email,
//         password,
//         pc,
//         playstation,
//         xbox,
//         fortnite,
//         minecraft,
//         gta,
//         league,
//         f1,
//         valorant,
//         rl,
//         cod,
//         fifa,
//         stardew
//     })
//     console.log('User created succesfully:', response)
//     }
//     catch (error) {
//         if (error.code === 11000) {
//             return res.json({ status: 'error', error: 'Username has already been taken' })
//         }   
//     }
//     res.json({ status: 'ok' })
// })

// IGBD API setup (WIP)
// app.post(IGDB_TOKEN, async (req, res) => {
    
// })

/* Error: 404 Page */
app.use( (req, res) => {
    res.status(404).send('Error 404: file not found')
})

/* Start webserver */
app.listen(port, "0.0.0.0", function() {
console.log("Web server running on port 3000");
})
