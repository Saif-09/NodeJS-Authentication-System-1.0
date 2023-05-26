// Require necessary modules
const express = require("express");
// Create Express app
const app = express();
require('dotenv').config();
const session = require('express-session');
const cookieParser = require("cookie-parser");
const MongoStore = require('connect-mongo');

const db = require("./config/database");
const passport = require('passport');
const localStrategy = require('./config/passport-local');
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const GoogleStrategy = require('./config/passport-google');
const User = require('./models/user');
const database = require("./config/database");

let port;

if(process.env.NODE_ENV=="production"){
    port = process.env.PORT || 6000;
}
else{
    port = 6000;
}

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

// Set static folder
app.use(express.static("assets"));

// set up the view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Configure the session middleware
app.use(session({
  secret: process.env.EXPRESS_SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL, 
      autoRemove: 'native', // remove expired sessions automatically
      ttl: 7 * 24 * 60 * 60 // set session TTL to 7 days
    })
}));

// Initialize Passport and use the local strategy
app.use(passport.initialize());
app.use(passport.session());
passport.use(localStrategy);

// Configure Passport to serialize and deserialize user objects to and from the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
});

// Use body-parser middleware
// app.use(bodyParser.urlencoded({ extended: true }));

// use express router
app.use("/", require("./routes"));



// Start server
app
  .listen(port)
  .on("error", function (err) {
    console.log(`Error in starting server ${err} `);
  })
  .on("listening", function () {
    console.log(`Server running on port:${port}`);
  });

db().then((res) => {
  console.log("Database connected");
});
