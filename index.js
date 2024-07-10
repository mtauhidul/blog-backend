require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model("Blog", blogSchema);

const mongoUrl = process.env.MONGODB_URI;
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

morgan.token("body", (req) => JSON.stringify(req.body));
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";
app.use(morgan(format));

app.get("/api/blogs", (req, res, next) => {
  Blog.find({})
    .then((blogs) => res.json(blogs))
    .catch(next);
});

app.get("/api/blogs/:id", (req, res, next) => {
  Blog.findById(req.params.id)
    .then((blog) => {
      if (blog) {
        res.json(blog);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/blogs/:id", (req, res, next) => {
  const { title, author, url, likes } = req.body;
  const blog = { title, author, url, likes };

  Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedBlog) => res.json(updatedBlog))
    .catch(next);
});

app.delete("/api/blogs/:id", (req, res, next) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

app.post("/api/blogs", (req, res, next) => {
  const { title, author, url, likes } = req.body;

  if (!title || !author || !url || likes === undefined) {
    return res.status(400).json({ error: "Anything missing!" });
  }

  const blog = new Blog({ title, author, url, likes });
  blog
    .save()
    .then((returnedBlog) => {
      res.status(201).json(returnedBlog);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id!" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
