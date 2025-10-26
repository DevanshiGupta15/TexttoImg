import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

// Debug logs to check if env vars are loaded (add these right after dotenv)
//console.log('JWT_SECRET loaded:', process.env.JWT_SECRET ? 'Yes' : 'No');
//console.log('RAZORPAY_KEY_ID loaded:', process.env.RAZORPAY_KEY_ID ? 'Yes' : 'No');
//console.log('JWT_SECRET value (first 10 chars):', process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 10) + '...' : 'undefined');

// Other imports (after dotenv and logs)
import express from 'express';
import cors from 'cors';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// Server setup
const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(cors());

await connectDB();

app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.get("/", (req, res) => res.send("Api working fine"));

app.listen(PORT, () => console.log("Server listening on port " + PORT));

