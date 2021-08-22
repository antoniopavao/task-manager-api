const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

// Defining user id for testing purposes
const userOneId = new mongoose.Types.ObjectId();

// Defining user for testing purposes
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
// Defining user id for testing purposes
const userTwoId = new mongoose.Types.ObjectId();

// Defining user for testing purposes
const userTwo = {
  _id: userTwoId,
  name: "Ygor",
  email: "ygor@example.com",
  password: "myhouse09@@",
  tokens: [
    {
      token: jwt.sign(
        {
          _id: userTwoId,
        },
        process.env.JWT_SECRET
      ),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "First task",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "Second task",
  completed: false,
  owner: userOne._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "Third task",
  completed: false,
  owner: userTwo._id,
};

// Deleting everything (users and tasks) in the database for new "users"
const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userOne).save();
  await new User(userTwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDatabase,
};
