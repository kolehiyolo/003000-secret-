//jshint esversion:6
// * Importing App NPM Dependencies
require(`dotenv`).config();
const express = require(`express`);
const bodyParser = require(`body-parser`);
const ejs = require(`ejs`);
const mongoose = require(`mongoose`);
const encrypt = require(`mongoose-encryption`);
const md5 = require(`md5`);
const bcrypt = require(`bcrypt`);
const session = require(`express-session`);
const passport = require(`passport`);
const passportLocalMongoose = require(`passport-local-mongoose`);

// * Setting up Express
const app = express(); // Setting up app head
app.use(express.static(`public`)); // Assigning default public path
app.set(`view engine`, `ejs`); // Setting EJS as view engine
app.use(bodyParser.urlencoded({
    extended: true
})); // For parsing req.body data from POST forms
const port = 3000; // Port number; Adjustable depending on eventual hosting config

// ! Proper Docu Needed
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
// ! Proper Docu Needed

// * Setting up MongoDB
mongoose.connect(`mongodb://127.0.0.1:27017/secretsDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); // Establishing connection to local MongoDB instance
const userSchema = new mongoose.Schema({
    email: String,
    password: String
}); // Defining the user schema

// * Setting up Mongoose-Encryption
const secret = process.env.SECRET; // ? This is the secret key, I believe
userSchema.plugin(encrypt, {
    secret: secret,
    encryptedFields: ["password"]
}); // Setting up the encryption plugin within the userSchema so that any save or find done on the model will trigger mongoose-encryption's methods
// This only affects the "password" field as indicated
userSchema.plugin(passportLocalMongoose); // ! Proper Docu Needed
const User = new mongoose.model(`User`, userSchema); // Creating a new collection "User" using the user schema
passport.use(User.createStrategy()); // ! Proper Docu Needed
passport.serializeUser(User.serializeUser()); // ! Proper Docu Needed
passport.deserializeUser(User.deserializeUser()); // ! Proper Docu Needed
const saltRounds = 10;

// * EXPRESS ROUTES
// -* GET Home
app.get(`/`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /`);
    console.log(`-Rendering home page`);

    res.render(`home`);
});

// -* GET Login
app.get(`/login`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /login`);
    console.log(`-Rendering login page`);

    res.render(`login`);
});

// -* GET Register
app.get(`/register`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /register`);
    console.log(`-Rendering register page`);

    res.render(`register`);
});

// -* POST Register
app.post(`/register`, function (req, res) {
    console.log(`\n`);
    console.log(`POST /register`);


});

// -* POST Login
app.post(`/login`, function (req, res) {
    console.log(`\n`);
    console.log(`POST /login`);

});

// -* Listener
app.listen(port, function () {
    console.log(`Server started on ${port}`);
});