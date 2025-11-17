const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const { checkLogin } = require("./auth.controller");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

getUserDetails = async (req, res, next) => {
  if (!req.user) {
    res.status(404);
    next(new Error("User not found"));
  }
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
    lastExpenseDate: req.user.lastExpenseDate,
    expense: req.user.expenseCount
  });
};

updateUserDetails = async (req, res, next) => {
  const { name } = req.body;


  if (!req.user) {
    res.status(404);
    return next(new Error("User not found"));
  }
  const user = await User.findById(req.user._id);
  console.log("user", user.name);

  if (name != "" && name != user.name) {
    user.name = name;
    await user.save();
    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });
    res.status(200).json({ message: "User updated successfully", user });
  } else {
    const error = new Error("Couldnt save the changes");
    res.status(409);
    return next(error);
  }
};


logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

checkLogin = async (req, res, next) => {
  if (req.user) {
    res.status(200).json({ message: "Authorised" })
  } else {
    const error = new Error("no user");
    res.status(400);
    return next(error);
  }
};

module.exports = {
  getUserDetails,
  updateUserDetails,
  logoutUser,
  checkLogin
};
