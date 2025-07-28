import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { envVars } from "./env";

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      // You can implement user logic for Google login here.
      return done(null, profile);
    }
  )
);
