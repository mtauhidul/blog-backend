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

blogsRouter.put("/:id", async (req, res, next) => {
  const { title, author, url, likes } = req.body;
  const blog = { title, author, url, likes };

  if (likes !== undefined && typeof likes !== "number") {
    return res.status(400).json({ error: "Likes must be a number" });
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
      new: true,
      runValidators: true,
      context: "query",
    });

    if (updatedBlog) {
      res.json(updatedBlog);
    } else {
      res.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:id", (req, res, next) => {
  Blog.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next);
});

blogsRouter.post("/", (req, res, next) => {
  const { title, author, url, likes } = req.body;

  if (!title || !author || !url) {
    return res
      .status(400)
      .json({ error: "Title, author, and url are required!" });
  }

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes !== undefined ? likes : 0,
  });

  blog
    .save()
    .then((returnedBlog) => {
      res.status(201).json(returnedBlog);
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
