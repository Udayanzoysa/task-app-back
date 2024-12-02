const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const http = require("http");
const socketIo = require("socket.io");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes(io));
app.use("/api", userRoutes(io));

const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
