const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();
const port = 3000;

// IMPORT
const Crystal = require("./models/crystal.js");

// MIDDLEWARE
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));

//LANDING PAGE
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

// FORM
app.get("/crystals/new", (req, res) => {
  res.render("crystals/new.ejs");
});

// CREATE
app.post("/crystals", async (req, res) => {
  try {
    const crystal = await Crystal.create(req.body);
    console.log(crystal);
    return res.redirect("/crystals/new");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// 404 HANDLER
app.get("*", (req, res) => {
  return res.status(404).send("Route not found");
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
