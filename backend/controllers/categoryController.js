const Category = require("../models/Category");

// CREATE
exports.createCategory = async (req, res) => {
    try {
      const product = await Category.create(req.body);
      res.status(201).json({ success: true, product });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
};

// GET ALL
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json({ success: true, categories });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET BY ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};