const router = require("express").Router();
const productController = require("../controllers/productController");

const validate = require("../middleware/validateQuery");

const {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  productListQuerySchema
} = require("../validators/productValidators");

// CREATE
router.post("/", validate(createProductSchema), productController.create);

// GET ALL
router.get("/", productController.getAll);

// GET BY ID
router.get("/:id", validate(getProductByIdSchema, "params"), productController.getById);

// UPDATE
router.put("/:id", validate(updateProductSchema), productController.update);

// DELETE
router.delete("/:id", validate(getProductByIdSchema, "params"), productController.remove);

// ADVANCED LIST
router.get(
  "/advanced/list",
  validate(productListQuerySchema),
  productController.getAdvancedList
);

module.exports = router;
