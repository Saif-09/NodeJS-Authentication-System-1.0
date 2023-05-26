// Require necessary modules
const express = require("express");
const dotenv = require("dotenv").config({ path: "/.env" });
const cookieParser = require("cookie-parser");
const port = 80;
const db = require("./config/database");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
// const User = require('./models/user');
const database = require("./config/database");

// Create Express app
const app = express();

app.use(express.urlencoded());
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

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));

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
