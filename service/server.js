import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import passport from 'passport';
import './passport-setup.js';
import cors from 'cors';
import spotifyRoutes from './spotifyRoutes.js';

const app = express();

// Redis client initialization
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

redisClient.connect().then(() => {
    console.log('Connected to Redis Cloud successfully');
}).catch((err) => {
    console.error('Redis Client Error', err);
});

// Redis Store for session
app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: process.env.NODE_ENV === "production", // Set to true in production
            httpOnly: true, // Minimize risk of XSS attacks
            sameSite: "strict", // Strictly same site
        }
    })
);

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Add the JSON body parser middleware
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use the Spotify routes
app.use('/api/spotify', spotifyRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
