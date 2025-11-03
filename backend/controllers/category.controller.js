const Category = require("../models/category.model");

getCategory = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400);
        next(new Error(error));
    }
}

addCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400);
            next(new Error("Category name is required"))
        }

        const category = new Category({ name });
        await category.save();

        res.status(201).json(category);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400);
            next(new Error("Category name is slready exist"))
        }
        res.status(400);
        next(new Error(error));
    }
}

module.exports = {
    getCategory,
    addCategory
};