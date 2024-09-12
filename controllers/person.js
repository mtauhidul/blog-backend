const express = require("express");
const personsRouter = express.Router();
const Person = require("../models/person");

personsRouter.get("/", async (req, res, next) => {
  try {
    const persons = await Person.find({});
    res.json(persons);
  } catch (error) {
    next(error);
  }
});

personsRouter.post("/", async (req, res, next) => {
  try {
    const { name, number } = req.body;

    if (!name || !number) {
      return res.status(400).json({ error: "Name and Number required!" });
    }

    const person = new Person({
      name,
      number,
    });

    const savedPerson = await person.save();
    res.status(201).json(savedPerson);
  } catch (error) {
    next(error);
  }
});

module.exports = personsRouter;
