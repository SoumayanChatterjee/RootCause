const router = require("express").Router();
const { adminSignup, adminLogin } = require("../controllers/adminAuthController");

router.post("/signup", adminSignup);
router.post("/login", adminLogin);

module.exports = router;