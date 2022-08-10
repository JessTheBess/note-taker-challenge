const express = require('express');
const { notes } = require('./db/db');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');

// parse icnoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());

function noteParts(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(notes => notes.title === query.title);
    }
    return filteredResults;
}

function newNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    return body;
}

function deleteNote(index, notesArray) {
    notesArray.splice(index, 1);
}

function checkNotes(query) {
    if(!query.title || typeof query.title !== 'string') {
        return false;
    }
    if(!query.text || typeof query.text !== 'string') {
        return false;
    }
    return true;
}

app.get('/api/notes', (req, res) => {
    let results = notes;
    if(req.query) {
        results = noteParts(req.query, results);
    }
    res.json(results);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/assets/js/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/js/index.js'));
});

app.get('/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, './public/assets/css/styles.css'));
});

// redirects the user to the notes page.
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.post('/api/notes', (req, res) => {
    if (!checkNotes(req.body)) {
        res.status(400).send('Invalaid note formatting, try again.');
    } else {
        let noteArray = notes;
        noteArray = newNote(req.body, noteArray);
        res.json(noteArray);
    }
});

app.delete(`/api/notes/:id`, (req, res) => {
   deleteNote(req.params.id, notes);
   res.send();
});




app.listen(PORT, () => {
    console.log(`API server is now on port ${PORT}!`);
});
