const express = require("express");
const router = express.Router();
const { Task, User } = require("../models");

const app = express();
app.use(express.json());

let userSockets = {};

module.exports = (io) => {
  router.post("/tasks", async (req, res) => {
    const { task_name, status, user_id } = req.body;

    try {
      if (!task_name) {
        return res.status(400).json({ error: "Task name is required." });
      }

      const task = await Task.create({
        task_name,
        status: status || "pending",
        user_id: user_id || null,
      });

      io.emit("page-refresh", { message: task, userId: user_id });

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const result = await Task.destroy({ where: { id } });
      if (result) {
        res.status(200).json({ message: "Task deleted successfully." });
      } else {
        res.status(404).json({ error: "Task not found." });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { task_name, status } = req.body;

    try {
      const task = await Task.findByPk(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found." });
      }

      await task.update({ task_name, status });
      res.status(200).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.put("/tasks/:id/assign", async (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    try {
      const task = await Task.findByPk(id);
      const user = await User.findByPk(user_id);

      if (!task || !user) {
        return res.status(404).json({ error: "Task or User not found." });
      }

      await task.update({ user_id });
      res.status(200).json({ message: "Task assigned successfully.", task });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.get("/tasks", async (req, res) => {
    const { user_id } = req.query;
    const user = await User.findByPk(user_id);

    try {
      let tasks;

      if (user.role === "admin") {
        tasks = await Task.findAll({
          include: {
            model: User,
            attributes: ["username"],
          },
        });
      } else {
        tasks = await Task.findAll({
          where: { user_id },
          include: {
            model: User,
            attributes: ["username"],
          },
        });
      }

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
