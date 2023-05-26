//jshint esversion:6
// * Importing App NPM Dependencies
const express = require(`express`);
const bodyParser = require(`body-parser`);
const ejs = require(`ejs`);

// * Setting up Express
const app = express(); // Setting up app head
app.use(express.static(`public`)); // Assigning default public path
app.set(`view engine`, `ejs`);  // Setting EJS as view engine
app.use(bodyParser.urlencoded({
    extended: true
})); // For parsing req.body data from POST forms
const port = 3000; // Port number; Adjustable depending on eventual hosting config


// * EXPRESS ROUTES
// -* GET Home
app.get(`/`, function(req, res) {
    console.log(`GET /`); 

    res.render(`home`);
}) ; 

// -* GET Login
app.get(`/login`, function(req, res) {
    console.log(`GET /login`); 

    res.render(`login`);
}) ; 

// -* GET Register
app.get(`/register`, function(req, res) {
    console.log(`GET /register`); 

    res.render(`register`);
}) ; 

// -* Listener
app.listen(port, function() {
    console.log(`Server started on ${port}`); 
});