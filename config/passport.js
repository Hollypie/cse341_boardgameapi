const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('✅ Google OAuth Success!');
      console.log('User:', profile.displayName, profile.emails?.[0]?.value);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('📝 SERIALIZE USER:', user.displayName);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log('📖 DESERIALIZE USER:', user.displayName);
  done(null, user);
});

module.exports = passport;
