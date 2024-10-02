const bcrypt = require("bcryptjs");

module.exports = [
  {
    username: "admin",
    password: bcrypt.hashSync("admin", 10),
  },
  {
    username: "joe",
    password: bcrypt.hashSync("joe", 10),
  },
  {
    username: "test",
    password: bcrypt.hashSync("test", 10),
  },
];
