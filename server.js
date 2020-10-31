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

    // If id of note to delete is in notes array then splice the array at that index
    for (let i=0; i<notes.length; i++) {
        if (parseInt(noteToDelete) === notes[i].id) {
            notes.splice(i, 1);
            writeFile("db/db.json", JSON.stringify(notes));
        }
    }
    
    return res.json(notes);
})

// Write db.json file.
function writeFile(filename, data) {

    fs.writeFile(filename, data, (err) => {
        if (err) {
            console.log("Error when appending data to db.json");
            console.log(err);
        }
    })
}

app.post("/api/notes", (req, res) => {

    let noteID = notes.length+1;

    // Check to see if ID is unique
    for (let i=0; i<notes.length; i++) {
        // If ID is note unique, get the highest ID and add 1 to it.
        if (noteID === notes[i].id) {
            let tempArrID = [];
            for (let j=0; j<notes.length; j++) {
                // Push all ID's from notes array into a temp array so all existing id's can be spread inside Math.max()
                tempArrID.push(notes[j].id);
            } 
            let max = Math.max(...tempArrID);
            // Add 1 to highest ID
            noteID = max+1;
        }
    }

    // Recently saved note
    let savedNote = {
        id: noteID,
        title: req.body.title,
        text: req.body.text
    }
    
    // Push saved note into notes array
    notes.push(savedNote);

    writeFile("db/db.json", JSON.stringify(notes));

    res.json(savedNote);
})

// Any undefined route name will direct the user to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

// Server listening on specified port number
app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
})

