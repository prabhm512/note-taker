// Dependencies 
const express = require("express");
const path = require("path");

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
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.get("/api/notes", (req, res) => {
    return res.json(notes);
})

app.post("/api/notes", (req, res) => {
    let savedNote = req.body;

    notes.push(savedNote);
    console.log(notes);
    res.json(savedNote);
})

app.listen(PORT, () => {
    console.log(`App listening on localhost:${PORT}`);
})

