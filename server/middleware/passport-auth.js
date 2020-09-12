const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User } = require('../models/userModel');
const { extractUsernameFromEmail, cookieExtractor } = require('../utils');

const JwtAuthCallback = async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.sub).select(
      '-local.password -__v -expires'
    );
    if (!user) return done(null, false);

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
};

const GoogleAuthCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(accessToken, profile);
    // find user with googleId
    const user = await User.findOne({ googleId: profile.id });
    if (user) {
      return done(null, user);
    }

    // check for existing user with same email as google email
    const existingUser = await User.findOne({ email: profile._json.email });
    if (existingUser) {
      // if we have a user with same email then we will link
      // the google account with local login credentials
      console.log('User already exist with same email');
      console.log('LINK ACCOUNT');
      existingUser.provider = ['local', 'google'];
      existingUser.googleId = profile.id;
      const savedUser = await existingUser.save();
      return done(null, savedUser);
    }

    // user does not exist let's create a new user
    console.log('User does not exist');
    const newUser = new User({
      username: extractUsernameFromEmail(profile._json.email),
      isVerified: true,
      expires: null,
      name: profile.displayName,
      provider: ['google'],
      googleId: profile.id,
      avatarUrl: profile._json.picture,
      email: profile._json.email,
    });
    const savedUser = await newUser.save();
    return done(null, savedUser);
  } catch (err) {
    return done(err, false);
  }
};

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/user/auth/google/callback',
      // passReqToCallback: true
    },
    GoogleAuthCallback
  )
);

passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.TOKEN_SECRET,
    },
    JwtAuthCallback
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
