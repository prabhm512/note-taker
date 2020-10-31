// Dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");

// Express app set up 
const app = express();
const PORT = process.env.PORT || 4000;

let notes = [];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware that loads js and css files in public/assets folder
app.use(express.static('public'));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
})

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("/api/notes", (req, res) => {
   return res.json(notes);
})

app.delete("/api/notes/:id", (req, res) => {
    let noteToDelete = req.params.id;

    for (let i=0; i<notes.length; i++) {
        if (parseInt(noteToDelete) === notes[i].id) {
            notes.splice(i, 1);
            writeFile("db/db.json", JSON.stringify(notes));
        }
    }
    
    return res.json(notes);
})

function writeFile(filename, data) {

    fs.writeFile(filename, data, (err) => {
        if (err) {
            console.log("Error when appending data to db.json");
            console.log(err);
        }
    })
}

app.post("/api/notes", (req, res) => {

    let savedNote = {
        id: notes.length+1,
        title: req.body.title,
        text: req.body.text
    }
    
    notes.push(savedNote);

    writeFile("db/db.json", JSON.stringify(notes));

    res.json(savedNote);
})

// Any undefined route name will direct the user to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
})

