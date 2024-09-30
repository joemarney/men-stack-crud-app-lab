const express = require("express");
const bcrypt = require("bcryptjs");

// ROUTER
const router = express.Router();

// MODEL
const User = require("../models/user.js");

// CONTROLLERS
// SIGN UP FORM
router.get("/sign-up", (req, res) => {
  return res.render("auth/sign-up.ejs");
});
// SIGN UP
router.post("/sign-up", async (req, res) => {
  try {
    // check passwords match
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(422).send("Passwords do not match");
    }
    // encrypt password
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    // create new user
    const newUser = await User.create(req.body);
    // redirect
    return res.redirect("/auth/log-in");
  } catch (error) {
    console.log(error);
    // error handling for when a username is already in use
    if (error.code === 11000) {
      const uniqueUser = Object.entries(error.keyValue)[0];
      return res
        .status(422)
        .send(`${uniqueUser[0]} ${uniqueUser[1]} already taken`);
    }
    return res.status(500).send("Error");
  }
});
// LOG IN FORM
router.get("/log-in", (req, res) => {
  return res.render("auth/log-in.ejs");
});
// LOG IN
router.post("/log-in", async (req, res) => {
  try {
    const userLogIn = await User.findOne({ username: req.body.username });
    console.log("login successful");
    if (!userLogIn) {
      return res.status(401).send("Login failed. Please try again.");
    }
    if (!bcrypt.compareSync(req.body.password, userLogIn.password)) {
      return res.status(401).send("Login failed. Please try again.");
    }
    req.session.user = {
      _id: userLogIn._id,
      username: userLogIn.username,
    };
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error");
  }
});

// LOG OUT
router.get("/log-out", (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});
// EXPORT
module.exports = router;
