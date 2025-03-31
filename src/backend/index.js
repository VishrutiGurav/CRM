const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const AuthRouter = require("./Routes/AuthRouter");
const ClientDetailsRouter = require("./Routes/ClientRouter");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const ClientDetails = require("./Models/ClientDetails");
const MouRouter = require("./Routes/MouRouter"); // Import MoU Routes // Import model

require("dotenv").config();
require("./Models/db");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app); // Attach HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow frontend access
    methods: ["GET", "POST"],
  },
});

const allowedOrigins = ["http://localhost:3000"]; 

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // ✅ Allow credentials (cookies, headers)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Middleware
app.use(bodyParser.json());
app.use(cors());

// ✅ CORS FIX: Allow frontend (http://localhost:3000) to communicate with the backend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow frontend
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, tokens)
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle CORS Preflight Requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }

  next();
});
app.use("/auth", AuthRouter);
app.use("/client", ClientDetailsRouter);
app.use("/api", MouRouter); 

// Health check route
app.get("/ping", (req, res) => {
  res.send("PONG");
  console.log("Ping route hit"); // ✅ Log when this route is accessed
});

// ✅ Socket.io logic with logs
io.on("connection", (socket) => {
  console.log("✅ New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ✅ MongoDB Change Stream to detect new entries in ClientDetails
const changeStream = ClientDetails.watch();
changeStream.on("change", (change) => {
  if (change.operationType === "insert") {
    console.log("🆕 New request added to MongoDB");
    io.emit("newRequest", {}); // Notify all connected clients
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

console.log("✅ Socket.io initialized, waiting for connections...");




