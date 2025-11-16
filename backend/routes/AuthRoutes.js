const AuthRouter = require("express").Router();
const { registerUser, loginUser } = require("../controllers/AuthController");

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);

module.exports = AuthRouter;
