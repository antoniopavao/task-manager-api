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
  const response = await request(app)
    .post("/users")
    .send({
      name: "Antonio",
      email: "a@example.com",
      password: "apm174dh",
    })
    .expect(201);

  // Assert that the database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  //Assertions about the response
  expect(response.body).toMatchObject({
    user: {
      name: "Antonio",
      email: "a@example.com",
    },
    token: user.tokens[0].token,
  });

  //Asserting that the database is not storing plain text password
  expect(user.password).not.toBe("apm174dh");
});

// Should Login existing user
test("Should login existing user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  // Assert that the database was changed correctly

  //--> Fetching user from the database
  const user = await User.findById(response.body.user._id);

  // --> Expecting that the user is not null
  expect(user).not.toBeNull();

  //Assert that the token in response matches users second token
  expect(response.body).toMatchObject({
    token: user.tokens[1].token,
  });
});

// Should not login nonexistent user
test("Should not login nonexistent user", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: "somewrongemail@example.com",
      password: "somewrongpassword@@@",
    })
    .expect(400);
});

//Should get profile for a user
test("Should get profile for a user", async () => {
  const response = await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

// Should not get profile for unauthenticated users
test("Should not get profile for unauthenticated users", async () => {
  const response = await request(app).get("/users/me").send().expect(401);
});

// Should delete account for user
test("Should delete account for user", async () => {
  const response = await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //--> Fetching user from the database
  const user = await User.findById(userOneId);

  // --> Expecting that the user is not null
  expect(user).toBeNull();
});

// Should not delete account for unauthenticated user
test("Should not delete account for unauthenticated user", async () => {
  const response = await request(app).delete("/users/me").send().expect(401);
});
