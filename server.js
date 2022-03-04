const express = require('express')



/* This is the object */
const app = express();
const port = 3000;



/* Routes */
app.get('/', (req, res) => {
    res.send('hello world')
})



/* Start webserver */
app.listen(port, () => {
    console.log(`web server running on http://localhost:${port}`)
})
