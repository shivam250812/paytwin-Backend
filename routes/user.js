const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User } = require("../Database/db");
const JWT_SECRET = require("../config");
const userRouter = express.Router();
const authMiddleware = require("/Users/adityadeshpande/Desktop/development/paytm-main/backend/routes/middleware.js");
const { Account } = require("../Database/db");

const signUpSchema = zod.object({
  name: zod.string(),
  username: zod.string(),
  password: zod.string(),
});
userRouter.post("/signUp", async (req, res) => {
  const body = req.body;
  const { success } = signUpSchema.safeParse(body);

  if (!success) {
    return res.json({
      message: "Email is already taken/Incorrect Inputs",
    });
  }

  const user = await User.findOne({
    username: body.username,
  });

  if (user && user._id) {
    return res.json({
      message: "Email is already taken/Incorrect Inputs",
    });
  }
  const dbUser = await User.create(body);
  const userId = dbUser._id;
  await Account.create({
    userId,
    balance: 1 + Math.random() * 1000,
  });

  const token = jwt.sign(
    {
      userId: dbUser._id,
    },
    JWT_SECRET
  );
  res.json({
    message: "User created Succjhessfully",
    token: token,
  });
});

const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});

userRouter.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Emaiiil already taken / Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

const updateBody = zod.object({
  password: zod.string().optional(),
  name: zod.string().optional(),
});

userRouter.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne(req.body, {
    id: req.userId,
  });

  res.json({
    message: "Updated successfully",
  });
});
userRouter.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";
  console.log(filter);
  const users = await User.find({
    $or: [
      {
        name: {
          $regex: filter,
        },
      },
    ],
  });

  console.log(users);

  res.json({
    user: users.map((user) => ({
      username: user.username,
      name: user.name,

      _id: user._id,
    })),
  });
});

module.exports = userRouter;
