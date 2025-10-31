const jwt = require("jsonwebtoken");
const User = require("../models/user.model");


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "10d",
    });
};

getUserDetails = async (req, res, next) => {
    if (!req.user) {
        res.status(404);
        return next(new Error("User not found"));
    }
    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
    });
}

updateUserDetails = async (req, res, next) => {
    if (!req.user) {
        res.status(404);
        return next(new Error("User not found"));
    }
    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt
    });
}
module.exports = {
    getUserDetails,
    updateUserDetails
};
