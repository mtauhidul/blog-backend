const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const helper = require("../utils/list_helper");
const Blog = require("../models/blog");
const User = require("../models/user");

describe("when there are initially some blogs saved", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are five blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
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

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
    assert.ok(newlyAddedBlog);
    assert.deepEqual(newlyAddedBlog, { ...newBlog, id: newlyAddedBlog.id });
  });

  test("missing likes property set to zero", async () => {
    const newBlog = {
      title: "Introduction to TypeScript",
      author: "Carol White",
      url: "https://example.com/typescript-intro",
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const newlyAddedBlog = response.body;

    assert.strictEqual(newlyAddedBlog.likes, 0);
  });

  describe("deletion of a blog post", () => {
    test("succeeds with status code 204 if id is valid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDb();

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);

      const titles = blogsAtEnd.map((r) => r.title);
      assert(!titles.includes(blogToDelete.title));
    });
  });

  describe("updating the number of likes for a blog post", () => {
    test("succeeds with valid data", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const updatedBlogInDb = blogsAtEnd.find(
        (blog) => blog.id === blogToUpdate.id
      );

      assert.ok(updatedBlogInDb);
      assert.strictEqual(updatedBlogInDb.likes, updatedBlog.likes);
    });

    test("fails with status code 400 if data is invalid", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];

      const invalidUpdate = {
        ...blogToUpdate,
        likes: "invalid",
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
