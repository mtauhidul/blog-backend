const express = require("express");
const notesRouter = express.Router();
const Note = require("../models/note");

notesRouter.get("/", async (req, res, next) => {
  try {
    const notes = await Note.find({});
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

notesRouter.post("/", async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content required!" });
    }

    const note = new Note({
      content,
    });

    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

module.exports = notesRouter;
