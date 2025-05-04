if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const locationsRouter = require('./routes/locations');
const reviewsRouter = require('./routes/reviews');
const authRouter = require('./routes/auth');
const passport = require('passport');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('./passport-config');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/DateScape';
const secret = process.env.SECRET;

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('trust proxy', 1);

app.use(cors({
    origin: [
        process.env.FRONTEND_URI,
        'http://localhost:5173'
    ],
    credentials: true
}));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

app.use(session({
    store,
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', authRouter)
app.use('/api/locations', locationsRouter);
app.use('/api/locations/:id/reviews', reviewsRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'))
});

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message)
        err.message = 'Something Went Wrong';
    res.status(status).send(err.message);
});

app.listen(8080, () => {
    console.log("Listening on port 8080");
});