const express = require("express");

const dns = require("dns");

dns.setServers(["8.8.8.8", "8.8.4.4"]);
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

const FRONTEND_URL = "https://findrly.vercel.app/";

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

// =========================
// Middlewares
// =========================

app.use(express.json());

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(morgan("dev"));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =========================
// Routes
// =========================

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/items", require("./routes/itemRoutes"));

app.use("/api/claims", require("./routes/claimRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/messages", require("./routes/messageRoutes"));
app.get("/health", (req,res) => {
  res.send("Site is working"); 
})

// =========================
// Socket.IO
// =========================

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Join a specific claim chat room
  socket.on("join_claim_room", (claimId) => {
    socket.join(claimId);

    console.log(
      `Socket ${socket.id} joined room ${claimId}`
    );
  });

  // Send message to users in the claim room
  socket.on("send_message", (data) => {
    // Expected data:
    // {
    //   claimId,
    //   messageObj
    // }

    io.to(data.claimId).emit(
      "receive_message",
      data.messageObj
    );
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// =========================
// Root Route
// =========================

app.get("/", (req, res) => {
  res.send("TrustTrace API with Real-time Chat is running...");
});

// =========================
// Error Handling Middleware
// =========================

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: err.message || "Server Error",
  });
});

// =========================
// Start Server
// =========================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Start server only if DB connection succeeds
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server.");

    process.exit(1);
  }
};

startServer();