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
const localStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const dbUrl = process.env.DB_URL;
//'mongodb://127.0.0.1:27017/DateScape'

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'https://datescape-frontend.onrender.com/', credentials: true }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});

app.use(session({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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