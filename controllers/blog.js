const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

blogsRouter.get("/", (req, res, next) => {
  Blog.find({})
    .populate("user", {
      username: 1,
      name: 1,
    })
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

blogsRouter.post("/", async (req, res, next) => {
  const { title, author, url, likes, userId } = req.body;

  const decodedToken = jwt.verify(getTokenFrom(req), process.env.TOKEN_SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  const user = await User.findById(userId);

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
    user: user.id,
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

module.exports = blogsRouter;
