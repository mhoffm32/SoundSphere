const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const heroData = require("./utils/heroData");
const { connectToMongo } = require("./config/mongo");
const { router: emailRoutes, setClient } = require("./routes/email");

const app = express();
const port = process.env.PORT || 5001;
const host = process.env.HOST || "0.0.0.0";

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("client"));

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(`${req.method} request for ${fullUrl}`);
  next();
});

// Route setup (email is added after DB is connected)
app.use("/hero", require("./routes/hero"));
app.use("/users", require("./routes/users"));
app.use("/lists", require("./routes/lists"));
app.use("/logs", require("./routes/logs"));
app.use("/policy", require("./routes/policy"));

// Test endpoint
app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Express service is healthy" });
});

// Start the server only after DB connection and hero data load
const startServer = async () => {
  try {
    await connectToMongo(); // Connect to MongoDB
    setClient(); // Set DB client for email routes

    console.log("Connected to MongoDB");

    heroData.loadHeroData((err) => {
      if (err) {
        console.error("Failed to load hero data:", err);
        process.exit(1);
      } else {
        app.use("/email", emailRoutes); // Now safe to register email routes

        app.listen(port, host, () => {
          console.log(`Express service running at http://${host}:${port}`);
        });
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
