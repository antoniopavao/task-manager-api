const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
} = require("./fixtures/db");

// This will run before each test case
// --> Deleting everything in the database and setup the default user for login tests
beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From my test",
    })
    .expect(201);

  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should not create task with invalid description", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "",
    })
    .expect(400);
});

test("Should not create task with invalid fields", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      location: "Osasco",
    })
    .expect(400);
});

test("Should not create task with invalid completed", async () => {
  await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      completed: "yes",
    })
    .expect(400);
});

test("Should request all tasks for user", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  expect(response.body.length).toEqual(2);
});

test("Should not update task with invalid description", async () => {
  await request(app)
    .patch("/tasks/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      description: "",
    })
    .expect(400);
});

test("Should not update task with invalid completed", async () => {
  await request(app)
    .patch("/tasks/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      completed: "yes",
    })
    .expect(400);
});

test("Should delete user task", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not be able to delete tasks from other people", async () => {
  const response = await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});

test("Should not delete tasks if unauthenticated", async () => {
  await request(app).delete(`/tasks/${taskOne._id}`).send().expect(401);
});
