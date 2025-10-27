import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import session from 'express-session';
import passport from 'passport';
import './config/passport.js';

// Other imports
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// Server setup
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests ONLY from your frontend
    credentials: true                // Allow cookies and authorization headers
}));

await connectDB();

app.use(session({
    // CRITICAL FIX: Use a unique, long string for session encryption
    secret: 'c0833bc9eab92164e1b49bfac4388ce1_SESSION', 
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Must be set to 'lax' for local HTTP redirects (Google Auth) to work
        sameSite: 'lax', 
        // Must be 'false' for local 'http://localhost' connections
        secure: false,   
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.get("/", (req, res) => res.send("Api working fine"));

app.listen(PORT, () => console.log("Server listening on port " + PORT));


// Google Login Initiation
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google Callback Route
app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }), // Redirect to /login on failure
    (req, res) => {
        // Successful authentication, redirect client to the homepage
        res.redirect('http://localhost:5173/'); 
    }
);