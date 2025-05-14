const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const { connection } = require("./config/db"); //  Get connection from config

const heroData = require("./utils/heroData"); // Import the new module for hero data

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("client"));

// Logging
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

// Routes
app.use("/api/hero", require("./routes/hero"));
app.use("/api/users", require("./routes/users"));
app.use("/api/lists", require("./routes/lists"));
app.use("/api/logs", require("./routes/logs"));
app.use("/api/policy", require("./routes/policy"));

const emailRoutes = require("./routes/email");
emailRoutes.setConnection(connection);
app.use("/api/email", emailRoutes);

// Set DB connection on email router and use it
//emailRoutes.setConnection(connection); //  inject connection

// Test endpoint
app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

// Load hero data at app startup
heroData.loadHeroData((err) => {
  if (err) {
    console.error("Failed to load hero data:", err);
    process.exit(1); // Exit if data can't be loaded
  } else {
    console.log("Hero data loaded successfully");

    // Start server after loading the data
    app.listen(port, host, () => {
      console.log(`Server running at http://${host}:${port}`);
    });
  }
});
