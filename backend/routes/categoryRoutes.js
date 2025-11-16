const router = require("express").Router();
const categoryController = require("../controllers/categoryController");
const validate = require("../middleware/validateQuery");

const {
  createCategorySchema,
  updateCategorySchema,
  getCategoryByIdSchema
} = require("../validators/categoryValidators");

// CREATE
router.post("/", validate(createCategorySchema), categoryController.createCategory);

// GET ALL
router.get("/", categoryController.getAllCategories);

// GET BY ID
router.get("/:id", validate(getCategoryByIdSchema, "params"), categoryController.getCategoryById);

// UPDATE
router.put("/:id", validate(updateCategorySchema), categoryController.updateCategory);

// DELETE
router.delete("/:id", validate(getCategoryByIdSchema, "params"), categoryController.deleteCategory);

module.exports = router;
