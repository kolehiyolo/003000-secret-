//jshint esversion:6
// * Importing App NPM Dependencies
const express = require(`express`);
const bodyParser = require(`body-parser`);
const ejs = require(`ejs`);
const mongoose = require(`mongoose`);

// * Setting up Express
const app = express(); // Setting up app head
app.use(express.static(`public`)); // Assigning default public path
app.set(`view engine`, `ejs`);  // Setting EJS as view engine
app.use(bodyParser.urlencoded({
    extended: true
})); // For parsing req.body data from POST forms
const port = 3000; // Port number; Adjustable depending on eventual hosting config


// * Setting up MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/secretsDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); // Establishing connection to local MongoDB instance
const User = new mongoose.model(`User`, {
    email: String,
    password: String
}); // Creating a new collection "User" using the indicated schema

// * EXPRESS ROUTES
// -* GET Home
app.get(`/`, function(req, res) {
    console.log(`\n`); 
    console.log(`GET /`); 
    console.log(`-Rendering home page`); 

    res.render(`home`);
}) ; 

// -* GET Login
app.get(`/login`, function(req, res) {
    console.log(`\n`); 
    console.log(`GET /login`); 
    console.log(`-Rendering login page`); 

    res.render(`login`);
}) ; 

// -* GET Register
app.get(`/register`, function(req, res) {
    console.log(`\n`); 
    console.log(`GET /register`); 
    console.log(`-Rendering register page`); 

    res.render(`register`);
}) ; 

// -* POST Register
app.post(`/register`, function(req, res) {
    console.log(`\n`); 
    console.log(`POST /register`); 
    console.log(`-Processing user registration`); 
    console.log(`-Creating new user based on inputs`); 

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    
    console.log(`-New user created:`); 
    console.log(newUser); 

    console.log(`-Inserting new user to "User" collection`); 
    User.collection.insertOne(newUser, (err)=>{
        if (err) {
            console.log(`-ERROR ENCOUNTERED:`); 
            console.log(err); 
        } else {
            console.log(`-Insert successful`); 
            console.log(`-Rendering "Secrets" Page`); 
            res.render(`secrets`);
        }
    })
}) ; 

// -* Listener
app.listen(port, function() {
    console.log(`Server started on ${port}`); 
});