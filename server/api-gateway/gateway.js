const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log full URL of each incoming request
app.use((req, res, next) => {
  console.log(
    `Incoming request: ${req.method} ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`
  );
  next();
});

// Service URLs
const EXPRESS_SERVICE_URL =
  process.env.EXPRESS_SERVICE_URL || "http://localhost:5001";
const FLASK_SERVICE_URL =
  process.env.FLASK_SERVICE_URL || "http://127.0.0.1:5002";

// Proxy for Express service
const expressServiceProxy = createProxyMiddleware({
  target: EXPRESS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // Rewriting path to ensure it forwards correctly
    return path.replace(/^\/api\/express/, "");
  },
  logLevel: "debug", // For debugging
});

// Proxy for Flask service
const flaskServiceProxy = createProxyMiddleware({
  target: FLASK_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // Rewriting path for Flask service (remove `/api/flask`)
    return path.replace(/^\/api\/flask/, "");
  },
  logLevel: "debug", // For debugging
});

// Use proxies for specific paths
app.use("/api/express", expressServiceProxy); // Routes to Express
app.use("/api/flask", flaskServiceProxy); // Routes to Flask

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "API Gateway is healthy" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("API Gateway Error:", err);
  res.status(500).json({ error: "Internal Server Error at API Gateway" });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Express service at: ${EXPRESS_SERVICE_URL}`);
  console.log(`Flask service at: ${FLASK_SERVICE_URL}`);
});

module.exports = app;
