const express = require("express");
const { register, login, protected } = require("../controllers/authController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

const authorize = (roles) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Access Denied" });
    }

    try {
      const decoded = jwt.verify(token, "your_secret_key");
      req.user = decoded;

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (err) {
      res.status(400).json({ message: "Invalid Token" });
    }
  };
};

router.post("/register", register);
router.post("/login", login);

router.get("/user-list", authenticate, authorize(["admin"]), (req, res) => {
  res.send({ message: "Welcome to the admin dashboard" });
});

router.get("/protected", authenticate, (req, res) => {
  res.json({ message: "This is a protected route!", user: req.user });
});

module.exports = router;
