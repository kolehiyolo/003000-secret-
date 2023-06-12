const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy({
        // options for the google strategy
        clientID: '227083110199-0td31td6f0cnef0vs5ihmlo6jd7v7h7n.apps.googleusercontent.com',
        clientSecret: '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',
        callbackURL: '/auth/google/redirect'
    },     (accessToken, refreshToken, profile, done) => {
    }),
);