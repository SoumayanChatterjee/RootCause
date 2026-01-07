const router = require("express").Router();
const { verifyToken, allowRoles } = require("../middleware/authMiddleware");

router.get(
  "/farmer",
  verifyToken,
  allowRoles("FARMER"),
  (req, res) => {
    res.json({ message: "Farmer protected data accessed" });
  }
);

router.get(
  "/admin",
  verifyToken,
  allowRoles("ADMIN"),
  (req, res) => {
    res.json({ message: "Admin protected data accessed" });
  }
);

module.exports = router;
