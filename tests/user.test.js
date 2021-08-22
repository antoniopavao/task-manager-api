const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

// This will run before each test case
// --> Deleting everything in the database and setup the default user for login tests
beforeEach(setupDatabase);

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

test("Should not signup user witn invalid password", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "blabla",
      email: "heysister@gmail.com",
      password: "p",
    })
    .expect(400);
});

test("Should not signup user with invalid email", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "blabla",
      email: "heysistergmail.com",
      password: "p",
    })
    .expect(400);
});

test("Should not signup user witn invalid name", async () => {
  await request(app)
    .post("/users")
    .send({
      email: "heysistergmail.com",
      password: "p",
    })
    .expect(400);
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

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Wilson" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toBe("Wilson");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "Osasco" })
    .expect(400);

  const user = await User.findById(userOneId);
  expect.not.objectContaining(user.location);
});

test("Should not update user with invalid email", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ email: "antoniopavao.com" })
    .expect(400);
});

test("Should not update user with invalid email", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ email: "antoniopavao.com" })
    .expect(400);
});

test("Should not update user with invalid name", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "" })
    .expect(400);
});
