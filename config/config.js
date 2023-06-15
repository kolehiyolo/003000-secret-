const express = require(`express`); // Primary back-end framework
const bodyParser = require(`body-parser`); // Parsing POST requests
const ejs = require(`ejs`); // Template engine for HTML rendering
const app = express(); // Setting up app object

app.use(express.static(`public`)); // Assigning default public path
app.set(`view engine`, `ejs`); // ? Setting EJS as view engine
app.use(bodyParser.urlencoded({
    extended: true
})); // ? For parsing req.body data from POST forms

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
    password: String,
    googleId: String,
    facebookId: String,
}); // Defining the user schema

// ! ----------------------------------------
// * SETUP EXPRESS-SESSION + PASSPORT-LOCAL-MONGOOSE
// -* Requiring dependencies
const session = require(`express-session`);
const passport = require(`passport`);
const passportLocalMongoose = require(`passport-local-mongoose`);
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const findOrCreate = require(`mongoose-findorcreate`);

// -* Configurations
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
})); // Setting up my express app to utilize sessions

app.use(passport.initialize()); // Initializing passport with express
app.use(passport.session()); // Needed for persistent login sessions

userSchema.plugin(passportLocalMongoose); // Including the passport-local-mongoose package into the schema for automatic encryption of essential credentials
userSchema.plugin(findOrCreate); // TODO Not sure
const User = new mongoose.model(`User`, userSchema); // Creating a new collection "User" using the user schema
passport.use(User.createStrategy()); // TODO Not sure

passport.use(
    new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
},     function(accessToken, refreshToken, profile, cb) {
    console.log(`GOOGLE STRATEGY`); 
    console.log(profile); 
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
}));

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/secrets'
  }, function(accessToken, refreshToken, profile, cb) {
    console.log(`FACEBOOk STRATEGY`); 
    console.log(profile); 
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
}));

passport.serializeUser((user, done) => {
    done(null, user);
}); // TODO Not sure
passport.deserializeUser((user, done) => {
    done(null, user);
}); // TODO Not sure

module.exports = {
    app: app,
    User: User
};