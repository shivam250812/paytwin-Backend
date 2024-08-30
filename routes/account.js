const express = require("express");
const authMiddleware = require("./middleware");
const { Account, User } = require("../Database/db");
const { default: mongoose } = require("mongoose");

const router = express.Router();

router.get("/balance", authMiddleware, async (req, res) => {

  const account = await Account.findOne({
    userId: req.userId,
  });

  if (!account) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const user = await User.findById(req.userId); // Find user by _id

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  console.log(user);
  res.json({
    name: user.name, // Un-commented the name field to include in response
    balance: account.balance,
    userId:account.userId
  });
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  // Fetch the accounts within the transaction
  const account = await Account.findOne({ userId: req.userId }).session(
    session
  );

  if (!account || account.balance < amount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
    await session.abortTransaction();
    return res.status(400).json({
      message: "Invalid account",
    });
  }

  // Perform the transfer
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: -amount } }
  ).session(session);
  await Account.updateOne(
    { userId: to },
    { $inc: { balance: amount } }
  ).session(session);

  // Commit the transaction
  await session.commitTransaction();
  res.json({
    message: "Transfer successful",
  });
});

router.post("/addmoney",authMiddleware,async (req,res)=>{
  const { amount } = req.body;
  await Account.updateOne(
    { userId: req.userId },
    { $inc: { balance: amount } }
  )

  res.json({
    message:"Money added"
  })
})

module.exports = router;
