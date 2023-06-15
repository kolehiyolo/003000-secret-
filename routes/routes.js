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

// -* auth with Facebook
router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/secrets',
    passport.authenticate('facebook', {
        failureRedirect: '/login',
        failureMessage: true
    }),
    function (req, res) {
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

    // if (req.isAuthenticated()) {
    //     console.log(`-User is logged in`);
    //     console.log(`-Rendering secrets page`);
    //     res.render(`secrets`);
    // } else {
    //     console.log(`-User is not logged in`);
    //     console.log(`-Redirecting to GET /login`);
    //     res.redirect(`/login`);
    // }

    // User.find({
    //     'secrets': {
    //         $ne: null
    //     }
    // }, (err, foundUsers) => {
    //     if (err) {
    //         console.log(`-ERROR ENCOUNTERED:`);
    //         console.log(err);
    //         res.send(err);
    //     } else {
    //         if (foundUsers) {
    //             res.render("secrets", {
    //                 usersWithSecrets: foundUsers
    //             })
    //         }
    //     }
    // });

    async function stuff() {
        const foundUsers = await User.find({ 'secrets': { $ne: null } });
        if (foundUsers) {
          res.render("secrets", { usersWithSecrets: foundUsers });
        } else {
          console.log(`-ERROR ENCOUNTERED:`);
          console.log(err);
          res.send(err);
        }
    }

    stuff()
});

// -* GET Submit
router.get(`/submit`, function (req, res) {
    console.log(`\n`);
    console.log(`GET /submit`);

    if (req.isAuthenticated()) {
        console.log(`-User is logged in`);
        console.log(`-Rendering submit page`);
        res.render(`submit`);
    } else {
        console.log(`-User is not logged in`);
        console.log(`-Redirecting to GET /login`);
        res.redirect(`/login`);
    }
});

// -* POST Submit
router.post(`/submit`, function (req, res) {
    console.log(`\n`);
    console.log(`POST /submit`);

    if (req.isAuthenticated()) {
        console.log(`-User is logged in`);
        console.log(`-Processing secret submission`);

        const submittedSecret = req.body.secret;

        async function stuff() {
            const foundUser = await User.find({
                _id: req.user._id
            });
            try {
                console.log(foundUser);
                console.log(submittedSecret);
                foundUser[0].secrets.push(submittedSecret);
                console.log(foundUser[0]);
                await foundUser[0].save();
                res.redirect(`/secrets`);
            } catch (err) {
                console.log(`-ERROR ENCOUNTERED:`);
                console.log(err);
                res.redirect(`/secrets`);
            }
        }
        stuff();
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
        email: req.body.email
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
        email: req.body.email,
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