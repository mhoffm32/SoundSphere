const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const client = require("./config/mongo");
const heroData = require("./utils/heroData");

const app = express();
const port = process.env.PORT || 5001;
const host = process.env.HOST || "0.0.0.0";

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static("client"));

// CORS setup - Allow requests from the frontend (port 3000) and API Gateway (port 4000)
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"], // Allow frontend and API Gateway origins
    methods: "GET,POST,PUT,DELETE", // Allow specific methods
    credentials: true, // Allow cookies or other credentials to be sent with the request
  })
);

app.use((req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  console.log(`${req.method} request for ${fullUrl}`);
  next();
});

// Routes
app.use("/hero", require("./routes/hero"));
app.use("/users", require("./routes/users"));
app.use("/lists", require("./routes/lists"));
app.use("/logs", require("./routes/logs"));
app.use("/policy", require("./routes/policy"));

const emailRoutes = require("./routes/email");
emailRoutes.setConnection(client);
app.use("/email", emailRoutes);

// Test endpoint
app.get("/api", (req, res) => {
  res.json({ users: ["user1", "user2", "user3"] });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Express service is healthy" });
});

// Load hero data at app startup
heroData.loadHeroData((err) => {
  if (err) {
    console.error("Failed to load hero data:", err);
    process.exit(1);
  } else {
    app.listen(port, host, () => {
      console.log(`Express service running at http://${host}:${port}`);
    });
  }
});

module.exports = app;
