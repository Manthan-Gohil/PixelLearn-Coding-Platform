const express = require("express");
const cors = require("cors");
const { FRONTEND_URL } = require("./config/config");
const apiRoutes = require("./routes");

const app = express();

// Middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api", apiRoutes);

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
