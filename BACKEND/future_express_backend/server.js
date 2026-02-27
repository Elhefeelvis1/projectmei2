import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy } from "passport-local";
import env from "dotenv";
import bcrypt from 'bcrypt';

import db from './db.js';
import {loginUser, registerUser} from './auths/userAuth.js';

const app = express();
const port = 5000;
const saltRounds = 5;
env.config();

app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({extended: true}));
// Express Session
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    } //24hrs cookie
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Starting database connection
db.connect();



// Passport Authentication
passport.use("local", new Strategy (async function verify(username, password, cb){
    try{
        let user = await userAuth.loginUser(username, password, db);

        if(user == "wrong password"){
            return cb(null, false, { message: 'Wrong Password!!'});
        }else if(user == "does not exist"){
            return cb(null, false, { message: 'Not registered, yet.' });
        }else{
            return cb(null, user);
        }
    }catch(err){
        return cb(err);
    }
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
})
passport.deserializeUser((user, cb) => {
    cb(null, user)
})

//Listening at port >> 3000
app.listen(port, () => {
    console.log(`Server running at ${port}`)
})