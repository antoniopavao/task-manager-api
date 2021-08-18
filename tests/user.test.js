const request = require("supertest");

const app = require("../src/app");

test("Should signup a new user", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "Antonio",
      email: "seo@gmail.com",
      password: "apm174dh",
    })
    .expect(201);
});
