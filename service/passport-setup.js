import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
    new SpotifyStrategy(
        {
            clientID: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            callbackURL: process.env.SPOTIFY_CALLBACK_URL,
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
            // Attach the access and refresh tokens to the profile object
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;

            // Now, when you serialize the user, you'll have access to these tokens
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    // When storing the user session, store the entire profile including tokens
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    // When the user is deserialized, it includes the tokens
    done(null, obj);
});
