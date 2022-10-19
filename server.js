const express = require('express')
const fs = require("fs");
const path = require('path');

const app = express()
const uuid = require('./helpers/uuid');
const PORT = process.env.PORT || 3035;

// Sets up the Express app to handle data parsing (to send data back and forth on the internet)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Letting express server know that all static content/client-side related files will live in the 'public' folder
app.use(express.static('public'));



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });



// GET request for notes
app.get('/api/notes', (req, res) => {
   // Inform the client
   fs.readFile('./db/db.json', 'utf8', (err, data) => {
res.json(JSON.parse(data))
   })
});


// POST request to add a note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile('./db/db.json', JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

// // Delete a note
// app.delete('/api/notes/:id', (req, res) => {
//   // const sql = `DELETE FROM notes WHERE id = ?`;
//   // const params = [req.params.id];
  
//   // db.query(sql, params, (err, result) => {
//   //   if (err) {
//   //     res.statusMessage(400).json({ error: res.message });
//   //   } else if (!result.affectedRows) {
//   //     res.json({
//   //     message: 'Note not found'
//   //     });
//   //   } else {
//   //     res.json({
//   //       message: 'deleted',
//   //       changes: result.affectedRows,
//   //       id: req.params.id
//   //     });
//   //   }
//   res.send('Delete request sent to ')
// });
// // app.delete(path, callback [, callback ...])
// // app.use('/abcd', (req, res, next) => {
// //   next()
// // })



app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
