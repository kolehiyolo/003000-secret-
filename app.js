// ! ----------------------------------------
// * SETUP EXPRESS
// -* Requiring dependencies
require(`dotenv`).config(); // Utilizing Environment Variables
const express = require(`express`); // Primary back-end framework
const bodyParser = require(`body-parser`); // Parsing POST requests
const ejs = require(`ejs`); // Template engine for HTML rendering

// -* Configurations
const app = express(); // Setting up app object
app.use(express.static(`public`)); // Assigning default public path
app.set(`view engine`, `ejs`); // ? Setting EJS as view engine
app.use(bodyParser.urlencoded({
    extended: true
})); // ? For parsing req.body data from POST forms
const port = 3000; // Port number; Adjustable depending on eventual hosting config

// ! ----------------------------------------
// * SETUP MONGODB + MONGOOSE
// -* Requiring dependencies
const mongoose = require(`mongoose`); // Handling MongoDB requests

// -* Configurations
mongoose.connect(`mongodb://127.0.0.1:27017/secretsDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}); // ? Establishing connection to local MongoDB instance
const userSchema = new mongoose.Schema({
    email: String,
    password: String
}); // Defining the user schema

// ! ----------------------------------------
// * SETUP EXPRESS-SESSION + PASSPORT-LOCAL-MONGOOSE
// -* Requiring dependencies
const session = require(`express-session`);
const passport = require(`passport`);
const passportLocalMongoose = require(`passport-local-mongoose`);

// -* Configurations
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
})); // Setting up my express app to utilize sessions

app.use(passport.initialize()); // Initializing passport with express
app.use(passport.session()); // Needed for persistent login sessions

userSchema.plugin(passportLocalMongoose); // Including the passport-local-mongoose package into the schema for automatic encryption of essential credentials
const User = new mongoose.model(`User`, userSchema); // Creating a new collection "User" using the user schema
passport.use(User.createStrategy()); // TODO Not sure
passport.serializeUser((user, done) =>{
    done(null, user);
  }); // TODO Not sure
passport.deserializeUser((user, done) =>{
    done(null, user);
  }); // TODO Not sure

// ! ----------------------------------------
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

// -* GET Secrets
app.get(`/secrets`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /secrets`);

    if (req.isAuthenticated()) {
        console.log(`-User is logged in`);
        console.log(`-Rendering secrets page`);
        res.render(`secrets`);
    } else {
        console.log(`-User is not logged in`);
        console.log(`-Redirecting to GET /login`);
        res.redirect(`/login`);
    }
});

// -* GET Logout
app.get(`/logout`, function(req, res) {
    console.log(`\n`);
    console.log(`GET /register`);
    
    req.logout((err)=> {
        if (err) {
            console.log(`-ERROR ENCOUNTERED:`);
            console.log(err);
            res.redirect(`/secrets`);
        } else {
            res.redirect(`/`);
        }
    });
}) ; 

// -* POST Register
app.post(`/register`, function (req, res) {
    console.log(`\n`);
    console.log(`POST /register`);

    User.register({
        username: req.body.username
    }, req.body.password, (err, user) => {
        if (err) {
            console.log(`-ERROR ENCOUNTERED:`);
            console.log(err);
            res.redirect(`/register`);
        } else {
            passport.authenticate(`local`)(req, res, () => {
                res.redirect(`/secrets`);
            });
        }
    });
});

// -* POST Login
app.post(`/login`, function (req, res) {
    console.log(`\n`);
    console.log(`POST /login`);

    const user = new User({
        email: req.body.username,
        password: req.body.password
    })

    req.login(user, (err) => {
        if (err) {
            console.log(`-ERROR ENCOUNTERED:`);
            console.log(err);
            res.redirect(`/login`);
        } else {
            passport.authenticate(`local`)(req, res, () => {
                res.redirect(`/secrets`);
            });
        }
    })
});

// -* Listener
app.listen(port, function () {
    console.log(`Server started on ${port}`);
});