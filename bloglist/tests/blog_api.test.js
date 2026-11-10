const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const helper = require("./test_helper");
const Blog = require("../models/blog");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);
let token;

describe("Blog API", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialBlogs);

    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("sekret", 10);
    const user = new User({ username: "root", passwordHash });
    await user.save();

    const loginResponse = await api
      .post("/api/login")
      .send({ username: "root", password: "sekret" });

    token = loginResponse.body.token;
  });

  describe("retrieving blogs", () => {
    test("blogs are returned as json", async () => {
      const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });

    test("unique identifier property of the blog posts is named id", async () => {
      const response = await api.get("/api/blogs");

      assert.strictEqual(
        response.body.every((blog) => blog.id !== undefined),
        true,
      );
    });
  });

  describe("adding blogs", () => {
    test("a valid blog can be added", async () => {
      const newBlog = {
        title: "Test Blog 2",
        author: "Test Author 2",
        url: "https://test.com",
        likes: 10,
      };
      const initialResponse = await api.get("/api/blogs");
      const initialLength = initialResponse.body.length;

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialLength + 1);
    });

    test("adding a blog fails with status code 401 if token is not provided", async () => {
      const newBlog = {
        title: "Test Blog 2",
        author: "Test Author 2",
        url: "https://test.com",
        likes: 10,
      };

      await api.post("/api/blogs").send(newBlog).expect(401);
    });

    test("if likes property is missing from request, it will default to 0", async () => {
      const newBlog = {
        title: "Test Blog 3",
        author: "Test Author 3",
        url: "https://test3.com",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");
      const addedBlog = response.body.find(
        (blog) => blog.title === newBlog.title,
      );
      assert.strictEqual(addedBlog.likes, 0);
    });
  });

  describe("validate blog data", () => {
    test("blog without title and url is not added", async () => {
      const newBlog = {
        author: "Test Author 4",
        likes: 5,
      };
      const initialResponse = await api.get("/api/blogs");
      const initialLength = initialResponse.body.length;

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialLength);
    });
  });

  describe("deleting blogs", () => {
    test("deleting a blog", async () => {
      const initialResponse = await api.get("/api/blogs");
      const initialLength = initialResponse.body.length;
      const blogToDelete = new Blog({
        title: "Blog to delete",
        author: "Test Author",
        url: "https://delete.com",
        likes: 5,
        user: (await User.findOne({ username: "root" }))._id,
      });

      await blogToDelete.save();

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const response = await api.get("/api/blogs");
      assert.strictEqual(response.body.length, initialLength);
    });
  });

  describe("updating blogs", () => {
    test("updating a blog", async () => {
      const initialResponse = await api.get("/api/blogs");
      const blogToUpdate = initialResponse.body[0];
      const updatedBlogData = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: blogToUpdate.likes + 1,
      };

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlogData)
        .expect(200);

      const response = await api.get("/api/blogs");
      const updatedBlog = response.body.find(
        (blog) => blog.id === blogToUpdate.id,
      );
      assert.strictEqual(updatedBlog.likes, updatedBlogData.likes);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
