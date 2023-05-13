//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set(`view engine`, `ejs`);
app.use(bodyParser.urlencoded({
    extended: true
}))

mongoose.connect("mongodb://127.0.0.1:27017/secretsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
    console.log(`GET /`);

    res.render("home");
});

app.get("/register", function (req, res) {
    console.log(`GET /register`);

    res.render("register");
});

app.get("/login", function (req, res) {
    console.log(`GET /login`);

    res.render("login");
});


app.post("/register", function (req, res) {
    console.log(`POST /register`);

    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    User.collection.insertOne(newUser, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", (req, res) => {
    console.log(`POST /login`); 
    const username = req.body.username;
    const password = req.body.password;

    User.collection.findOne({
        email: username
    }, (err, foundUser) => {
        if (err) {
            console.error(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    console.log(`LOGIN successfully`);
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function () {
    console.log(`Server started on port 3000`);
});