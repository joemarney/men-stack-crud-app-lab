const mongoose = require("mongoose");
require("dotenv/config");

const Crystal = require("../models/crystal.js");
const User = require("../models/user.js");

const crystalData = require("./data/crystals.js");
const userData = require("./data/users.js");

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection established");
    const clearDb = await Crystal.deleteMany();
    console.log(`${clearDb.deletedCount} Crystals deleted from DB`);
    const clearUsers = await User.deleteMany();
    console.log(`${clearUsers.deletedCount} Users deleted from DB`);
    const users = await User.create(userData);
    console.log(`${users.length} Users added to DB`);
    const creators = crystalData.map((crystal) => {
      crystal.creator = users[Math.floor(Math.random() * users.length)]._id;
      return crystal;
    });
    const crystal = await Crystal.create(creators);
    console.log(`${crystal.length} Crystals added to DB`);
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.log(error);
  }
};

runSeed();
