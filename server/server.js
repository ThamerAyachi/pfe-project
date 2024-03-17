const express = require("express");
const mongoose = require("mongoose");

const publicRouting = require("./routes/common/publicRoutes");
const authRouting = require("./routes/common/authRoutes");
const condidatRouting = require("./routes/condidat/apiRoutes");
const entrepriseRouting = require("./routes/entreprise/apiRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT | 3000;

mongoose
  .connect("mongodb://127.0.0.1:27017/platform")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("", publicRouting);
app.use("/auth", authRouting);

app.use("/condidat", condidatRouting);
app.use("/entreprise", entrepriseRouting);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
  console.log("Server running at port: " + PORT);
});
