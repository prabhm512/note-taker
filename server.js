// Dependencies 
const express = require("express");
const path = require("path");
const fs = require("fs");
const { notStrictEqual } = require("assert");

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

app.get("/api/notes/:id", (req, res) => {
    let deletedNote = req.params.id;

    fs.readFile("db/db.json", (err, data) => {
        if (err) {
            console.log("Error when reading db.json in /api/notes/:id");
            console.log(err);
        }

        else {
            let parsedData = JSON.parse(data)

            for (let i=0; i<parsedData.length; i++) {
                if (parseInt(deletedNote) === parsedData[i].id) {
                    return res.json(parsedData[i]);
                }

                else {
                    return res.json(false);
                }
            }
        }
    })
})

app.post("/api/notes", (req, res) => {

    let savedNote = {
        id: notes.length+1,
        title: req.body.title,
        text: req.body.text
    }
   
    notes.push(savedNote);

    fs.writeFile("db/db.json", JSON.stringify(notes), (err) => {
        if (err) {
            console.log("Error when appending data to db.json");
            console.log(err);
        }
        else {
            console.log("Successfully added notes to db.json!");
        }
    })

    res.json(savedNote);
})

// Any undefined route name will direct the user to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
})

