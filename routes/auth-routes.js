const router = require(`express`).Router();
const passport = require('passport');

// auth login
router.get(`/login`, (req,res)=> {
    console.log(`GET /login`); 

    res.render(`login`);
});

// auth logout
router.get(`/logout`, (req,res)=> {
    console.log(`GET /logout`); 

    // handle with passport
    res.send(`logging out`);
});

// auth with google
router.get(`/google`,     passport.authenticate('google', {
    scope: ['profile']
    })
);

module.exports = router;