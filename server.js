const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
require("dotenv/config");

const app = express();
const port = 3000;

// IMPORT
const Crystal = require("./models/crystal.js");

// MIDDLEWARE
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

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
    return res.redirect("/crystals");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// READ
app.get("/crystals", async (req, res) => {
  try {
    const crystals = await Crystal.find();
    return res.render("crystals/index.ejs", {
      crystals: crystals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// SHOW
app.get("/crystals/:crystalId", async (req, res, next) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.crystalId)) {
      const crystal = await Crystal.findById(req.params.crystalId);
      if (!crystal) return next();
      return res.render("crystals/show.ejs", { crystal });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// DELETE
app.delete("/crystals/:crystalId", async (req, res) => {
  try {
    await Crystal.findByIdAndDelete(req.params.crystalId);
    return res.redirect("/crystals");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// EDIT
app.get("/crystals/:crystalId/edit", async (req, res, next) => {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params.crystalId)) {
      const crystal = await Crystal.findById(req.params.crystalId);
      if (!crystal) return next();
      return res.render("crystals/edit.ejs", { crystal });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// UPDATE
app.put("/crystals/:crystalId", async (req, res) => {
  try {
    await Crystal.findByIdAndUpdate(req.params.crystalId, req.body, {
      returnDocument: "after",
    }); // ask
    return res.redirect("/crystals");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

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
