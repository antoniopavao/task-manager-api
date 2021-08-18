const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "Mike",
  email: "mike@example.com",
  password: "56what!!",
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
