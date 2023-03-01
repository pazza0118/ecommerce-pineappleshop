const express = require("express");
const router = express.Router();

const { getUserById } =
  require("../controllers/userController");
const { generateToken, processPayment } =
  require("../controllers/braintreeController");
const { requireSignin, isAuth } =
  require("../controllers/authController");

router.param("userId", getUserById)
router.get("/braintree/getToken/:userId",
  requireSignin, isAuth, generateToken)
router.post("/braintree/buy/:userId",
  requireSignin, isAuth, processPayment)

module.exports = router;