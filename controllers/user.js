const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/", async (req, res, next) => {
  const { name, username, password } = req.body;

  try {
    if (username && password) {
      if (password.length >= 3) {
        const isUserDuplicate = await User.findOne({ username });
        console.log(isUserDuplicate);
        if (!isUserDuplicate) {
          const saltRounds = 10;
          const passwordHash = await bcrypt.hash(password, saltRounds);

          const user = new User({
            name,
            username,
            passwordHash,
          });

          const savedUser = await user.save();
          res.status(201).json(savedUser);
        } else {
          res.status(400).send("username already exists");
        }
      } else {
        res
          .status(400)
          .send("username and password must be at least 3 characters long");
      }
    } else {
      res.status(400).send("invalid username or password");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
