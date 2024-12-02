const express = require("express");
const router = express.Router();
const { User } = require("../models");
const app = express();
app.use(express.json());

module.exports = (io) => {
  router.post("/users", async (req, res) => {
    const { username, email, role } = req.body;

    try {
      if (!username || !email) {
        return res
          .status(400)
          .json({ error: "Username and email are required." });
      }

      const user = await User.create({
        username,
        email,
        role: role || "user",
      });

      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get("/users", async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { username, email, role } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      await user.update({ username, email, role });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await User.destroy({ where: { id } });

      if (result) {
        res.status(200).json({ message: "User deleted successfully." });
      } else {
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  return router;
};
