// Dependencies 
const express = require("express");
const path = require("path");

// Express app set up 
const app = express();
const PORT = process.env.port || 4000;

let notes = [];

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
})

app.listen(PORT, () => {
    console.log(`App listening on https://localhost/${PORT}`);
})

