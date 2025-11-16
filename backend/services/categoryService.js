const categoryService = require("../services/categoryService");

// CREATE
exports.create = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// GET ALL
exports.getAll = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET BY ID
exports.getById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    if (!category)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const updated = await categoryService.updateCategory(req.params.id, req.body);

    if (!updated)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, category: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const deleted = await categoryService.deleteCategory(req.params.id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Category not found" });

    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
