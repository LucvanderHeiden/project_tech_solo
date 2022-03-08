const express = require('express')



/* Constants and variables */
const app = express();
const port = 3000;
const movies = [
        {
            "id": 1,
            "slug": "call-of-duty",
            "name": "Call of Duty",
            "year": "2021",
            "categories": ["action", "fps"]
        },
        {
            "id": 2,
            "slug": "battlefield",
            "name": "Battlefield",
            "year": "2021",
            "categories": ["action", "fps"]
        },
        {
            "id": 3,
            "slug": "rocket-league",
            "name": "Rocket League",
            "year": "2015",
            "categories": ["sports", "party"]
        },
        {
            "id": 4,
            "slug": "f1-2021",
            "name": "F1 2021",
            "year": "2021",
            "categories": ["sports", "racing"]
        }

]



/* Routes */
app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/jan', (req, res) => {
    res.send('hello jan')
})

app.get('/name/:name', (req, res) => {
    res.send(`hello ${req.params.name}`)
})




/* Start webserver */
app.listen(port, () => {
    console.log(`web server running on http://localhost:${port}`)
})
