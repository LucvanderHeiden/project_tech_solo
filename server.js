const { generatePrimeSync } = require('crypto');
const express = require('express')



/* Constants and variables */
const app = express();
const port = 2000;
const game = [
        {
            "id": 1,
            "slug": "call-of-duty",
            "name": "Call of Duty",
            "year": "2021",
            "categories": ["Action", "FPS"]
        },
        {
            "id": 2,
            "slug": "battlefield",
            "name": "Battlefield",
            "year": "2021",
            "categories": ["Action", "FPS"]
        },
        {
            "id": 3,
            "slug": "rocket-league",
            "name": "Rocket League",
            "year": "2015",
            "categories": ["Sports", "Party"]
        },
        {
            "id": 4,
            "slug": "f1-2021",
            "name": "F1 2021",
            "year": "2021",
            "categories": ["Sports", "Racing"]
        }

]




/* Routes */
app.get('/', (req, res) => {
    let doc ='<!doctype html>'
    doc += '<title>Games</title>'
    doc += '<h1>Games</h1>'

    game.forEach(game => {
        doc += "<section>";
        doc += `<h2>${game.name}</h2>`;
        doc += `<h3>${game.year}</h2>`;
        doc += "<h3>Categories:</h3>";
        doc += "<ul>";
        game.categories.forEach(category => {
            doc += `<li>${category}</li>`;
        });
        doc += "</ul>";
        doc += `a href="/games/${game.id}/${game.slug}">More info</a>`
        doc += "</section";
    })
    res.send(doc);
})




/* Start webserver */
app.listen(port, () => {
    console.log(`web server running on http://localhost:${port}`)
})
