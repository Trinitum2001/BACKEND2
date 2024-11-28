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
}

app.use(requestLogger);

let notes = [];

app.get('/', (req, res) => {
    res.send('<h1>API REST FROM NOTES</h1>');
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.json(notes);
    })
})

app.get('/api/notes/:id', (req, res) => {
    Note.findById(req.params.id)
    .then(note => {
        if(note){
            res.json(note);
        } else {
            res.status(404).end();
        }
    })
    .catch(error => {
        console.log(error);
        response.status(400).send({error: 'malfomated id'})
    })
})


app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    //console.log('Delete ID:', id);
    notes = notes.filter(n => n.id !== id);
    res.status(204).end();
})


app.post('/api/notes', (req, res) => {
    const body = req.body;
    if(!body.content){
        return res.status (400).json(
            {error: 'content missing'}
        )
    }
    const note =  new Note( {
        content: body.content,
        important: body.important || false,
    })
    note.save().then(result => {
        res.json(result);
    })
})

app.put('/api/notes/:id', (req, res) => {
    const body = req.body;
    const note = {
        content: body.content,
        important: body.important
    }
    Note.findByIdAndUpdate(req.params.id, note, {new: true})
    .then(result => {
        res.json(result);
    })
    .catch(error => { next(error) })
})


const port = process.env.PORT;

app.listen(port, () => {
console.log('Server running on port ' + port);

})