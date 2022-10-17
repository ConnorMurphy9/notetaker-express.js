const express = require('express')
const fs = require("fs");
const path = require('path');
const notesData = require('./db/db.json')
const app = express()

const PORT = 3010;

// Sets up the Express app to handle data parsing (to send data back and forth on the internet)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Letting express server know that all static content/client-side related files will live in the 'public' folder
app.use(express.static('public'));

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, './public/index.html'));
//   });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

app.get('/api/db', (req, res) => res.json (notesData));



// POST request
// app.post('/api/notes', (req, res) => {
//     // Let the client know that their POST request was received
//     res.json(`${req.method} request received`);
  
//     // Show the user agent information in the terminal
//     console.info(req.rawHeaders);
  
//     // Log our request to the terminal
//     console.info(`${req.method} request received`);
//   });
  


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));