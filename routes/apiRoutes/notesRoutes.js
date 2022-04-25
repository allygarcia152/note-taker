// require express
const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function readAsync() {
  const data = fs.readFileSync(path.join(__dirname, '../../db/db.json'), 'utf8');
  return data;
};

// function to add a note with a title and text to db.json 
async function createNewNote(body) {
  const title = body.title;
  const text = body.text;
  const newNote = { title, text, id: uuidv4() };

  readAsync().then(notes => {
    let notesArray = [].concat(JSON.parse(notes));
    notesArray.push(newNote);
    return notesArray;
  }).then(notes => {
    fs.writeFileSync(path.join(__dirname, '../../db/db.json'), JSON.stringify(notes));
  }).then(() => {
    return newNote;
  })
};

async function deleteNote(id) {
  readAsync().then(notes => {
    let notesArray = [].concat(JSON.parse(notes));
    var filteredArray = notesArray.filter(function (note) {
      if (note.id !== id) {
        return note;
      }
    });
    return filteredArray;
  }).then(notes => {
    fs.writeFileSync(path.join(__dirname, '../../db/db.json'), JSON.stringify(notes));
  })
};

// GET /api/notes read db.json file to retreave saved notes
router.get('/notes', (req, res) => {
  readAsync().then(notes => {
    let notesArr;
    if (notes){
      notesArr = [].concat(JSON.parse(notes));
    } else {
      notesArr = [];
    }
    return res.json(notesArr);
  });
});

// post /api/notes receives new notes to save to the request body and add to the db.json file (find npm package that gives each note a unique id)
router.post('/notes', (req, res) => {
  createNewNote(req.body).then(notes => {
    return res.json(notes);
  });
});

// DELETE note from left column
router.delete('/notes/:id', (req, res) => {
  let id = req.params.id;
  deleteNote(id).then(() => {
    return res.json({ ok: true});
  })
});

module.exports = router;