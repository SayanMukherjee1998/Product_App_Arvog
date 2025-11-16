const router = require("express").Router();

//All Auth Routes are entitled here.
router.use("/auth", require("./AuthRoutes"));

//All Product Routes are entitled here.
router.use("/products", require("./ProductRoutes"));

module.exports = router;