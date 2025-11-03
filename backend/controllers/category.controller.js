const Category = require("../models/category.model");
const User = require("../models/user.model");

getCategory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const categories = await Category.find({ user: userId });
    res.status(200).json(categories);
  } catch (error) {
    res.status(400);
    next(new Error(error));
  }
};

addCategory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    console.log(userId, req.user._id);

    const { name } = req.body;
    if (!name) {
      res.status(400);
      next(new Error("Category name is required"));
    }

    const category = new Category({ name, user: userId });
    await category.save();
    await User.findByIdAndUpdate(userId, {
      $push: { categories: category._id },
    });
    const updatedCategories = await Category.find({ user: userId });
    res.status(201).json(updatedCategories);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400);
      next(new Error("Category name is slready exist"));
    }
    res.status(400);
    next(new Error(error.message || "Failed to add category"));
  }
};

removeCategory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const category = await Category.findOneAndDelete({ _id: id, user: userId });
    if (!category) {
      res.status(404);
      return next(new Error("Category not found"));
    }

    await User.findByIdAndUpdate(userId, { $pull: { categories: id } });
    const updatedCategories = await Category.find({ user: userId });
    res.status(200).json(updatedCategories);
    
  } catch (error) {
    res.status(400);
    next(new Error(error.message || "Failed to remove category"));
  }
};

module.exports = {
  getCategory,
  addCategory,
  removeCategory,
};
