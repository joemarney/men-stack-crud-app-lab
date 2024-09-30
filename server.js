const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv/config");

const app = express();
const port = 3000;

// IMPORT
const crystalsRouter = require("./controllers/crystals.js");
const authController = require("./controllers/auth.js");

// MIDDLEWARE
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//LANDING PAGE
app.get("/", async (req, res) => {
  res.render("index.ejs", {
    user: req.session.user,
  });
});

// PROTECTED ROUTE
app.get("/vip-lounge", (req, res) => {
  try {
    if (req.session.user) {
      res.send(`Welcome to the party ${res.session.user.username}`);
    } else {
      res.send("Sorry, you are not on the list.");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// ROUTERS
app.use("/crystals", crystalsRouter);
app.use("/auth", authController);

// 404 HANDLER
app.get("*", (req, res) => {
  return res.render("fourohfour.ejs");
});

// SERVER
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection established");
    app.listen(port, () => {
      console.log(`Listening on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
