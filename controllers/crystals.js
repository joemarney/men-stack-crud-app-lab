const express = require("express");
const mongoose = require("mongoose");

// ROUTER
const router = express.Router();

// MODEL
const Crystal = require("../models/crystal.js");
// CONTROLLERS
// FORM
router.get("/new", (req, res) => {
  res.render("crystals/new.ejs");
});

// CREATE
router.post("/", async (req, res) => {
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
router.get("/", async (req, res) => {
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
router.get("/:crystalId", async (req, res, next) => {
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
router.delete("/:crystalId", async (req, res) => {
  try {
    await Crystal.findByIdAndDelete(req.params.crystalId);
    return res.redirect("/crystals");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// EDIT
router.get("/:crystalId/edit", async (req, res, next) => {
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
router.put("/:crystalId", async (req, res) => {
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

// EXPORT
module.exports = router;
