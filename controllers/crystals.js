const express = require("express");
const mongoose = require("mongoose");

// ROUTER
const router = express.Router();

// MODEL
const Crystal = require("../models/crystal.js");

//MIDDLEWARE
const isLoggedIn = require("../middleware/is-logged-in.js");

// CONTROLLERS
// FORM
router.get("/new", isLoggedIn, (req, res) => {
  res.render("crystals/new.ejs");
});

// CREATE
router.post("/", async (req, res) => {
  try {
    req.body.creator = req.session.user._id;
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
      const crystal = await Crystal.findById(req.params.crystalId).populate(
        "creator"
      );
      if (!crystal) return next();

      console.log("Creator:", crystal.creator);
      console.log("Logged in user:", res.locals.user);

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
    const crystalDelete = await Crystal.findById(req.params.crystalId);
    if (crystalDelete.creator.equals(req.session.user._id)) {
      await Crystal.findByIdAndDelete(req.params.crystalId);
      return res.redirect("/crystals");
    }
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
      if (!crystal.creator.equals(req.session.user._id)) {
        return res.redirect(`/crystals/${req.params.crystalId}`);
      }
      return res.render("crystals/edit.ejs", { crystal });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// UPDATE
router.put("/:crystalId", isLoggedIn, async (req, res) => {
  try {
    const crystalUpdate = await Crystal.findById(req.params.crystalId);
    if (crystalUpdate.creator.equals(req.session.user._id)) {
      await Crystal.findByIdAndUpdate(req.params.crystalId, req.body, {
        returnDocument: "after",
      }); // ask
      return res.redirect(`/crystals/${req.params.crystalId}`);
    }
    return res.redirect(`/crystals/${req.params.crystalId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// EXPORT
module.exports = router;
