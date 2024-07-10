const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", (req, res, next) => {
  Blog.find({})
    .then((blogs) => res.json(blogs))
    .catch(next);
});

blogsRouter.get("/:id", (req, res, next) => {
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

blogsRouter.put("/:id", (req, res, next) => {
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

blogsRouter.delete("/:id", (req, res, next) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

blogsRouter.post("/", (req, res, next) => {
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

module.exports = blogsRouter;
