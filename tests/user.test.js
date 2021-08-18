const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/user");

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
  _id: userOneId,
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!",
  tokens: [
    {
      token: jwt.sign(
        {
          _id: userOneId,
        },
        process.env.JWT_SECRET
      ),
    },
  ],
};

// This will run before each test case
// --> Deleting everything in the database and setup the default user for login tests
beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

// SIGN UP USER
test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Antonio",
      email: "a@example.com",
      password: "apm174dh",
    })
    .expect(201);
});

// Login user
test("Should login existing user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
});

// Should not login nonexistent user
test("Should not login nonexistent user", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: "somewrongemail@example.com",
      password: "somewrongpassword@@@",
    })
    .expect(400);
});

//Should get profile for a user
test("Should get profile for a user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

// Should not get profile for unauthenticated users
test("Should not get profile for unauthenticated users", async () => {
  await request(app).get("/users/me").send().expect(401);
});
