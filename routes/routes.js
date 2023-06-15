const router = require(`express`).Router();
const passport = require('passport');
const User = require('../config/config').User;

// ! ----------------------------------------
// * EXPRESS ROUTES
// -* GET Home
router.get(`/`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /`);

    console.log(`-Confirming if User is logged in to determine response`);
    if (req.isAuthenticated()) {
        console.log(`-User is logged in`);
        console.log(`-Redirecting to GET /secrets`);
        res.redirect(`/secrets`);
    } else {
        console.log(`-User is not logged in`);
        console.log(`-Rendering home page`);
        res.render(`home`);
    }
});

// -* auth with google+
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile']
}));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

router.get('/auth/google/secrets',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

// -* GET Login
router.get(`/login`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /login`);
    console.log(`-Rendering login page`);

    res.render(`login`);
});

// -* GET Register
router.get(`/register`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /register`);
    console.log(`-Rendering register page`);

    res.render(`register`);
});

// -* GET Secrets
router.get(`/secrets`, function (req, res) {
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
router.get(`/logout`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /register`);

    req.logout((err) => {
        if (err) {
            console.log(`-ERROR ENCOUNTERED:`);
            console.log(err);
            res.redirect(`/secrets`);
        } else {
            res.redirect(`/`);
        }
    });
});

// -* POST Register
router.post(`/register`, function (req, res) {
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
router.post(`/login`, function (req, res) {
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

module.exports = router;