const Blog = require("../models/blog");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => {
    return total + blog.likes;
  }, 0);
};

function favoriteBlog(blogs) {
  if (blogs.length === 0) return null;

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes ? blog : favorite;
  }, blogs[0]);
}

const initialBlogs = [
  {
    title: "Understanding JavaScript Closures",
    author: "John Doe",
    url: "https://example.com/js-closures",
    likes: 150,
  },
  {
    title: "A Guide to Node.js Performance Optimization",
    author: "Jane Smith",
    url: "https://example.com/nodejs-optimization",
    likes: 230,
  },
  {
    title: "Mastering React Hooks",
    author: "Alice Johnson",
    url: "https://example.com/react-hooks",
    likes: 300,
  },
  {
    title: "Building RESTful APIs with Express",
    author: "Bob Brown",
    url: "https://example.com/express-apis",
    likes: 175,
  },
  {
    title: "Learning GraphQL",
    author: "Eve White",
    url: "https://example.com/learning-graphql",
    likes: 180,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  initialBlogs,
  blogsInDb,
};
