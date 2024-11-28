require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const Note = require('./models/note');

app.use(express.json(), cors());
app.use(express.static('dist'));

const requestLogger = (req, res, next) => {
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('---');
    next();
};

app.use(requestLogger);

let notes = [];

app.get('/', (req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
});

app.get('/api/notes', (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes);
    });
});

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find((n) => n.id === id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    notes = notes.filter((n) => n.id !== id);
    res.status(204).end();
});

const generateId = () => {
    const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
    return maxId + 1;
};

app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({ error: 'content missing' });
    }
    const note = {
        id: generateId(),
        content: body.content,
        important: Boolean(body.important) || false,
    };
    notes = notes.concat(note);
    res.json(note);
});

app.put('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;

    const note = notes.find((n) => n.id === id);
    if (!note) {
        return res.status(404).json({ error: 'note not found' });
    }

    const updatedNote = {
        ...note,
        important: body.important,
    };

    notes = notes.map((n) => (n.id !== id ? n : updatedNote));
    res.json(updatedNote);
});

const port = process.env.PORT;

app.listen(port, () => {
    console.log('Server running on port ' + port);
});
