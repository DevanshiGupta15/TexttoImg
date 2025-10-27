import 'dontenv/config':
//import dotenv from 'dotenv';
//dotenv.config();

// Other imports
import session from 'express-session';
import passport from 'passport';
import './config/passport.js'; // Import passport config AFTER dotenv
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';
import jwt from "jsonwebtoken"; // Ensure jwt is imported if needed here, was missing before

// Server setup
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Correct for local development
    credentials: true
}));

await connectDB();

app.use(session({
    // Use your unique session secret
    secret: 'c0833bc9eab92164e1b49bfac4388ce1_SESSION',
    resave: false,
    saveUninitialized: false,
    cookie: {
        // Correct settings for local HTTP
        sameSite: 'lax',
        secure: false,
        maxAge: 1000 * 60 * 60 * 24
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// --- Use API routes ONCE ---
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
// --- Removed duplicate route lines ---

app.get("/", (req, res) => res.send("Api working fine"));

// Google Login Initiation
app.get('/api/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// --- UPDATED Google Callback Route ---
// (Use the version that generates JWT token for frontend compatibility)
const JWT_SECRET = 'c0833bc9eab92164e1b49bfac4388ce1'; // Ensure this matches userController/userAuth

app.get('/api/auth/google/callback',
    passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login?error=google_failed', session: false }),
    (req, res) => {
        if (!req.user) {
            return res.redirect('http://localhost:5173/login?error=auth_failed');
        }
        const token = jwt.sign({ id: req.user._id }, JWT_SECRET);
        res.redirect(`http://localhost:5173/?token=${token}`);
    }
);
// --- END UPDATED ROUTE ---


app.listen(PORT, () => console.log("Server listening on port " + PORT));
