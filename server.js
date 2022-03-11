const { generatePrimeSync } = require('crypto');
const express = require('express')

/* Register view engine */
app.set('view engine', 'ejs');          /* Bron gebruikt voor het opzetten van EJS: https://www.youtube.com/watch?v=yXEesONd_54 (The Net Ninja) */


/* Constants and variables */
const app = express();
const port = 3000;
const games = [
        {
            "id": 1,
            "slug": "call-of-duty",
            "name": "Call of Duty",
            "year": "2021",
            "categories": ["Action", "FPS"],
            "description": "Call of Duty is a military shooter published by Activision."
        },
        {
            "id": 2,
            "slug": "battlefield",
            "name": "Battlefield",
            "year": "2021",
            "categories": ["Action", "FPS"],
            "description": "Battlefield is a military shooter on large scale, developed by Dice."
        },
        {
            "id": 3,
            "slug": "rocket-league",
            "name": "Rocket League",
            "year": "2015",
            "categories": ["Sports", "Party"],
            "description": "Rocket League is a sports game where players control a rocket powered car trying to score goals against their opponents."
        },
        {
            "id": 4,
            "slug": "f1-2021",
            "name": "F1 2021",
            "year": "2021",
            "categories": ["Sports", "Racing"],
            "description": "F1 2021 is the latest installment in the racing game series based around the Formula 1 championship."
        }

]

/*********************************************************************
Middleware
***********************************************************************/
app.use(express.static('public'))

/*********************************************************************
Routes 
***********************************************************************/


/* Gamelist page */
app.get('/', (req, res) => {
    const id = req.params.id;
    const game = games.find(element => element.id == id);
    let doc ='<!doctype html>';
    doc += '<title>Games</title>';
    doc += '<h1>Games</h1>';
    

    games.forEach( game => {
        doc += "<section>";
        doc += `<h2>${game.name}</h2>`;
        doc += `<h3>${game.year}</h2>`;
        doc += "<h3>Categories:</h3>";
        doc += "<ul>";
        game.categories.forEach( category => {
            doc += `<li>${category}</li>`;
        });
        doc += "</ul>";
        doc += `<a href="/games/${game.id}/${game.slug}">More info</a>`;
        doc += "</section";
    })
    res.send(doc);
})


/* Game details page */
app.get('/games/:id/:slug', (req, res) => {
    const id = req.params.id;
    const game = games.find(element => element.id == id);
    console.log(id);

    let doc ='<!doctype html>';
    doc += `<title>Game details for ${game.name}</title>`;
    doc += `<h1>${game.name}</h1>`;
    doc += `<h2>${game.year}</h2>`;
    doc += "<h2>Categories:</h3>";
    doc += "<ul>";
    game.categories.forEach( category => {
         doc += `<li>${category}</li>`;
    });
    doc += "</ul>";
    doc += `<p>${game.description}</p>`;

    res.send(doc);
})


/* Error: 404 Page */
app.use( (req, res) => {
    res.status(404).send('Error 404: file not found')
})

/* Start webserver */
app.listen(port, () => {
    console.log(`web server running on http://localhost:${port}`)
})
