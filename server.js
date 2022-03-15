// Setup of packages
const { generatePrimeSync } = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const User = require('./models/user') 
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET_TOKEN;

const app = express();

// Connect to MongoDB
const dbURI = process.env.DATABASE_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('connected to database'))             /* Console.log om te checken of er een succesvolle connectie met de database is */
    .catch((err) => console.log(err))
/* Register view engine */
app.set('view engine', 'ejs');          /* Bron gebruikt voor het opzetten van EJS: https://www.youtube.com/watch?v=yXEesONd_54 (The Net Ninja) */


// Port

const port = 3000;


/*********************************************************************
Middleware              Bron gebruikt voor het opzetten van EJS: https://www.youtube.com/watch?v=_GJKAs7A0_4 (The Net Ninja)
***********************************************************************/
app.use(express.static('public'))
app.use(bodyParser.json())
app.use((req, res, next) => {
    console.log('new request made: ');
    console.log('host: ', req.hostname);
    console.log('path: ', req.path);
    console.log('method: ', req.method);
    next();
})



/*********************************************************************
Routes 
***********************************************************************/

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/create', (req, res) => {
    res.render('create');
});

app.get('/recover', (req, res) => {
    res.render('recover');
});


app.post('/api/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username }).lean()          /* Door .lean toe te voegen geef je aan dat je niet alle extra informatie eromheen nodig hebt.*/

    if(!user) {
        return res.json({ status: 'error', error: 'Invalid login credentials' })        /* Error message wanneer iemand een ongeldige username/password combinatie invoert */
    }
    
    if(await bcrypt.compare(password, user.password)) {             /* Checken of de combinatie van username en password klopt. */
        
        const token = jwt.sign({ 
            id: user._id, 
            username: user.username 
        }, JWT_SECRET)
    
        return res.json({ status: 'ok', data: token })
    }

    res.json({ status: 'error', data: 'Invalid login credentials' })
})

app.post('/api/register', async (req, res) => {
    const {username, email, password: plainTextPassword, pc, playstation, xbox} = req.body

    // Foutmeldingen bij het niet of verkeerd invoeren van velden
    if(!username || typeof username !== 'string') {
        return res.json({ status: 'error', error: 'Invalid username'})
    }

    if(!email || typeof email !== 'string') {
        return res.json({ status: 'error', error: 'Invalid email'})
    }

    if(!plainTextPassword || typeof plainTextPassword !== 'string') {
        return res.json({ status: 'error', error: 'Invalid password'})
    }

    // Foutmelding bij een te korte wachtwoord
    if(plainTextPassword.length < 4) {
        return res.json({ status: 'error', error: 'Password too short, password must be at least 5 characters.'})

    }

    const password = await bcrypt.hash(plainTextPassword, 10)

    try {
        const response = await User.create({
        username,
        email,
        password,
        pc,
        playstation,
        xbox
    })
    console.log('User created succesfully:', response)
    }
    catch (error) {
        if (error.code === 11000) {
            return res.json({ status: 'error', error: 'Username has already been taken' })
        }   
    }
    res.json({ status: 'ok' })
})

/* Error: 404 Page */
app.use( (req, res) => {
    res.status(404).send('Error 404: file not found')
})

/* Start webserver */
app.listen(port, () => {
    console.log(`web server running on http://localhost:${port}`)
})
