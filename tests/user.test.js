const { test, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const User = require("../models/user");
const app = require("../app");
const supertest = require("supertest");
const mongoose = require("mongoose");

const api = supertest(app);

test.only("invalid user creation test", async () => {
  const user = new User({
    name: "",
    username: "",
    password: "",
  });

  const response = await api.post("/api/users/").send(user).expect(400);

  assert(response.text.includes("invalid username or password"));
});

after(async () => {
  await mongoose.connection.close();
});
