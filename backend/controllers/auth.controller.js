const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10d",
  });
};

checkLogin = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.cookie("token", generateToken(user._id), {
      httpOnly: true,
      secure: true,
      maxAge: 10 * 24 * 60 * 60 * 1000,
      sameSite: "none",
    });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    const error = new Error("Invalid email or password");
    return next(error)
  }
};

signUpUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  console.log(userExists);
  if (userExists) {
    const error = new Error("User already exists");
    res.status(409);
    return next(error)
  }

  const user = await User.create({ name, email, password });
  console.log(user);

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    const error = new Error("Invalid user data");
    res.status(400);
    return next(error)
  }
};



module.exports = {
  checkLogin,
  signUpUser,
};
