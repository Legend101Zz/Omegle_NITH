const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const User = require("./models/user");

const authRoutes = require("./routes/authRoutes");

const PORT = process.env.PORT || process.env.API_PORT;
app.use(express.json());
app.use(cors());

// register the routes
app.use("/api/auth", authRoutes);
app.get("/testing", async (req, res) => {
  const data = await User.find();
  res.json(data);
});

const server = http.createServer(app);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
