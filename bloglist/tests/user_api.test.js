const bcrypt = require("bcrypt");
const User = require("../models/user");
const { test, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("./test_helper");

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("sekret", 10);

    const user = new User({ username: "root", passwordHash });
    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "knguyen",
      name: "Khanh Nguyen",
      password: "dragon1234",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });
});

describe("creation fails", () => {
  test("creation fails when username and password are less than 3 characters", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "og",
      name: "Short Username",
      password: "12",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(
      result.body.error,
      "username and password must be at least 3 characters long",
    );

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test("creation fails when username is not unique", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    assert.strictEqual(result.body.error, "username must be unique");

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});
