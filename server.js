const express = require('express');
const {notes} = require('../../');
const PORT = process.env.PORT || 3001;
const app = express();
const fs = require('fs');
const path = require('path');
const { get } = require('http');

function noteName(query, notesArray) {
    let filteredResults = notesArray;
    if (query.title) {
        filteredResults = filteredResults.filter(notes => notes.title === query.title);
    }
    return filteredResults;
}

app.get('/')

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/assets/js/index.js', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/js/index.js'));
});

app.get('/assets/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/assets/css/styles.css'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/notes.html'));
});

app.post('/api/notes', (req, res) => {
    if (!checkNotes(req.body)) {
        res.status(400).send('Invalid note formatting');
    } else {
        let noteArray = notes;
        noteArray = newNote(req.body, noteArray);
        res.json(noteArray);
        }
});

app.get('/test', function routeHandler(req, res) {

});
