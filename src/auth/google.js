const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const { ObjectId } = require("mongoose").Types;

const config = require("../config");
const User = require("../models/user");
const init = require("./init");

// https://mherman.org/blog/social-authentication-in-node-dot-js-with-passport/

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.cliendId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
    },
    async function (token, secret, profile, done) {
      try {
        let user = await User.findOne({
          $or: [{ id: profile.id }, { email: profile.emails[0].value }],
        });

        if (!user) {
          user = await User.create({
            id: profile.id,
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
          });
        }

        return done(null, user);
      } catch (error) {
        console.log("Google authentication error:", error);
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ id: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
