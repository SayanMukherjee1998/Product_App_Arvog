const router = require("express").Router();

//All Auth Routes are entitled here.
router.use("/auth", require("./AuthRoutes"));

//All Product Routes are entitled here.
router.use("/products", require("./ProductRoutes"));

//All Category Routes are entitled here.
router.use("/categories", require("./categoryRoutes"));

module.exports = router;