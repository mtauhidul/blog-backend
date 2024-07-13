const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const supertest = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const api = supertest(app);

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
    title: "Introduction to TypeScript",
    author: "Carol White",
    url: "https://example.com/typescript-intro",
    likes: 210,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogPromises = initialBlogs.map((blog) => {
    const blogObject = new Blog(blog);
    return blogObject.save();
  });

  await Promise.all(blogPromises);
});

test.only("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test.only("there are five notes", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 5);
});

after(async () => {
  await mongoose.connection.close();
});
