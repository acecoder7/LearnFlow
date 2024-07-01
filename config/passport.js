const passport = require('passport');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = mongoose.model('users');


passport.use(new GoogleStrategy({
    clientID: "52143740838-0apndjblkdlmssgmrc3ohe9hpcfsh5uk.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => { 
    try {
        const email = profile.emails[0].value;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User e", existingUser);
            return done(null, existingUser);
        }

        const user = await User.create({
            email,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
        });

        //console.log("User", user);

        done(null, user);

    } catch (error) {
        console.log("Error logging in with google", error);
        // done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => { 
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => done(err));
});