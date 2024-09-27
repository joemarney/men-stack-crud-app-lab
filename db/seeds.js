const mongoose = require("mongoose");
require("dotenv/config");

const Crystal = require("../models/crystal.js");

const crystalData = require("./data/crystals.js");

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connection established");
    const clearDb = await Crystal.deleteMany();
    console.log(`${clearDb.deletedCount} Crystals deleted from DB`);
    const crystal = await Crystal.create(crystalData);
    console.log(`${crystal.length} Crystals added to DB`);
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.log(error);
  }
};

runSeed();
