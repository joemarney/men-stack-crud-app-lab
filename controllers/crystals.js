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
router.post("/", isLoggedIn, async (req, res) => {
  try {
    req.body.creator = req.session.user._id;
    const crystal = await Crystal.create(req.body);
    req.session.message = "Crystal added successfully";
    req.session.save(() => {
      return res.redirect("/crystals");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render("crystals/new.ejs", { errors: error.errors, values: req.body });
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
      const crystal = await Crystal.findById(req.params.crystalId).populate("creator").populate("comments.user");
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
    throw new Error("User cannot perform this action!");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// CREATE COMMENT
router.post("/:crystalId/comments", async (req, res, next) => {
  try {
    req.body.user = req.session.user._id;
    const crystal = await Crystal.findById(req.params.crystalId);
    if (!crystal) return next();
    crystal.comments.push(req.body);
    await crystal.save();
    console.log(req.body);
    return res.redirect(`/crystals/${req.params.crystalId}`);
  } catch (error) {
    console.log(error);
    req.session.message = error.message;
    req.session.save(() => {
      return res.redirect(`/crystals/${req.params.crystalId}`);
    });
  }
});

// DELETE COMMENT
router.delete("/:crystalId/comments/:commentId", isLoggedIn, async (req, res, next) => {
  try {
    const crystal = await Crystal.findById(req.params.crystalId);
    if (!crystal) return next();
    const deleteComment = crystal.comments.id(req.params.commentId);
    if (!deleteComment) return next();
    if (!deleteComment.user.equals(req.session.user._id)) {
      throw new Error("User cannot perform this action!");
    }
    deleteComment.deleteOne();
    await crystal.save();
    return res.redirect(`/crystals/${req.params.crystalId}`);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// EXPORT
module.exports = router;
