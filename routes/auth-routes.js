const router = require(`express`).Router();

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
router.get(`/google`, (req,res)=> {
    console.log(`GET /google`); 

    // handle with passport
    res.send(`logging in with google`);
});

module.exports = router;