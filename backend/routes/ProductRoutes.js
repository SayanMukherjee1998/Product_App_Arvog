const router = require("express").Router();

const productController = require("../controllers/productController");
const bulkUploadController = require("../controllers/bulkUploadController");
const exportController = require("../controllers/exportController");

const validate = require("../middleware/validateQuery");
const upload = require("../middleware/upload");

const auth = require("../middleware/authMiddleware");
const requireRole = require("../middleware/requireRole");

const {
  createProductSchema,
  updateProductSchema,
  getProductByIdSchema,
  productListQuerySchema
} = require("../validators/productValidators");


//   PUBLIC ROUTES


// GET ALL (public)
router.get("/", productController.getAll);

// GET BY ID (public)
router.get("/:id", validate(getProductByIdSchema, "params"), productController.getById);

// ADVANCED LIST (public)
router.get(
  "/advanced/list",
  validate(productListQuerySchema),
  productController.getAdvancedList
);


//   PROTECTED ROUTES (JWT REQUIRED)


// CREATE PRODUCT → admin/manager only
router.post(
  "/",
  auth,
  requireRole("admin", "manager"),
  validate(createProductSchema),
  productController.create
);

// UPDATE PRODUCT → admin only
router.put(
  "/:id",
  auth,
  requireRole("admin"),
  validate(updateProductSchema),
  productController.update
);

// DELETE PRODUCT → admin only
router.delete(
  "/:id",
  auth,
  requireRole("admin"),
  validate(getProductByIdSchema, "params"),
  productController.remove
);

// BULK UPLOAD (CSV/XLSX) → admin only
router.post(
  "/bulk/upload",
  auth,
  requireRole("admin"),
  upload.single("file"),
  bulkUploadController.bulkUpload
);

// EXPORT PRODUCTS → admin/manager only
router.get(
  "/export/bulk",
  auth,
  requireRole("admin", "manager"),
  exportController.exportProducts
);

module.exports = router;
