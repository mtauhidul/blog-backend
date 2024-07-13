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
    title: "Learning GraphQL",
    author: "Eve White",
    url: "https://example.com/learning-graphql",
    likes: 180,
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

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are five blogs", async () => {
  const response = await api.get("/api/blogs");
  assert.strictEqual(response.body.length, 5);
});

test("blogs unique identifier is id", async () => {
  const response = await api.get("/api/blogs");
  const blog = response.body[0];
  assert.ok(blog.hasOwnProperty("id"));
});

test("test blog post method", async () => {
  const newBlog = {
    title: "Introduction to TypeScript",
    author: "Carol White",
    url: "https://example.com/typescript-intro",
    likes: 210,
  };

  await api
    .post("/api/blogs")
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  const newlyAddedBlog = response.body.find(
    (blog) => blog.title === "Introduction to TypeScript"
  );

  assert.strictEqual(response.body.length, initialBlogs.length + 1);
  assert.ok(newlyAddedBlog);
  assert.deepEqual(newlyAddedBlog, { ...newBlog, id: newlyAddedBlog.id });
});

after(async () => {
  await mongoose.connection.close();
});
