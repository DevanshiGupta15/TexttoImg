// D:\TexttoImg\server\config\passport.js

import 'dotenv/config'; // Keep this for loading other env vars if needed
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import userModel from '../models/userModel.js';

// --- RESTORED: Hardcode the required client ID and Secret for reliable local loading ---
// Make sure these are your ACTUAL keys
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// --- END RESTORED ---

// -- Google OAuth Strategy --
passport.use(new GoogleStrategy({
    // Use the hardcoded constants
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log('OAuth Callback Triggered'); // Keep for debugging
    console.log('Profile:', profile);
    try {
        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
            done(null, user);
        } else {
            const newUser = new userModel({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                creditBalance: 10
            });
            user = await newUser.save();
            done(null, user);
        }
    } catch (error) {
        console.error("Error during Google OAuth user find/create:", error);
        done(error, null);
    }
}));

// -- Session Management --
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userModel.findById(id);
        done(null, user);
    } catch (error) {
        console.error("Error during deserializeUser:", error);
        done(error, null);
    }
});