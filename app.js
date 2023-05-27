//jshint esversion:6
// * Importing App NPM Dependencies
const express = require(`express`);
const bodyParser = require(`body-parser`);
const ejs = require(`ejs`);
const mongoose = require(`mongoose`);
const encrypt = require(`mongoose-encryption`);

// * Setting up Express
const app = express(); // Setting up app head
app.use(express.static(`public`)); // Assigning default public path
app.set(`view engine`, `ejs`); // Setting EJS as view engine
app.use(bodyParser.urlencoded({
    extended: true
})); // For parsing req.body data from POST forms
const port = 3000; // Port number; Adjustable depending on eventual hosting config


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
const secret = "Thisisourlittlesecret."; // ? This is the secret key, I believe
userSchema.plugin(encrypt, {
    secret: secret,
    encryptedFields: ["password"]
}); // Setting up the encryption plugin within the userSchema so that any save or find done on the model will trigger mongoose-encryption's methods
// This only affects the "password" field as indicated
const User = new mongoose.model(`User`, userSchema); // Creating a new collection "User" using the user schema

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
    console.log(`-Processing user registration`);
    console.log(`-Creating new user based on inputs`);

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    console.log(`-New user created:`);
    console.log(newUser);

    // ? Mongoose's .save() no longer accepts callbacks
    // ? Using promises instead after queries
    console.log(`-Saving new user to "User" collection`);
    newUser.save()
    .then((result) => {
        console.log(`-Save successful:`);
        console.log(result); 
        console.log(`-Rendering "Secrets" Page`);
        res.render(`secrets`);
    })
    .catch((err) => {
        console.log(`-ERROR ENCOUNTERED:`);
        console.log(err);
    });
});

// -* POST Login
app.post(`/login`, function (req, res) {
    console.log(`\n`);
    console.log(`POST /login`);
    console.log(`-Processing user login`);

    const username = req.body.username;
    const password = req.body.password;
    console.log(`-User-given username+password:`);
    console.log(username);
    console.log(password);

    console.log(`-Finding a registered user that matches the given username`);

    // ? Mongoose's .find() no longer accepts callbacks
    // ? Using promises instead after queries
    User.find({
        'email': username,
    }).then((result) => {
        if (result) {
            console.log(`-User Found:`);
            const user = result[0];
            console.log(user);

            console.log(`-Checking if the user has the right password`);
            if (user.password === password) {
                console.log(`-Password matches`);
                console.log(`-Rendering "Secrets" Page`);
                res.render(`secrets`);
            } else {
                console.log(`-Password doesn't match`);
                console.log(`-Rendering "Login" Page`);
                res.render(`login`);
            }
        } else {
            console.log(`-No such user found`);
            console.log(`-Rendering "Login" Page`);
            res.render(`login`);
        }
    })
    .catch((err) => {
        console.log(`-ERROR ENCOUNTERED:`);
        console.log(err);
    });
});

// -* Listener
app.listen(port, function () {
    console.log(`Server started on ${port}`);
});