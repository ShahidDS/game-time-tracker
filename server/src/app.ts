import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes";
import gameRoutes from "./routes/gameRoutes";
import playSessionRoutes from "./routes/playSessionRoutes";

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
  "https://your-game-tracker-client.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  if (process.env.ENABLE_LOGGING === "true") {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  }
  next();
});

// Database connection health check
app.get("/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      version: process.env.npm_package_version || "1.0.0",
      database: "connected",
    });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(503).json({
      status: "ERROR",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      database: "disconnected",
      error: "Database connection failed",
    });
  }
});

// API routes
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/sessions", playSessionRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Game Tracker API",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV || "development",
    database: process.env.DATABASE_URL ? "configured" : "not configured",
    endpoints: {
      health: "/health",
      users: "/api/users",
      games: "/api/games",
      sessions: "/api/sessions",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);

    if (err.message === "Not allowed by CORS") {
      return res.status(403).json({
        error: "CORS policy: Origin not allowed",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Something went wrong",
    });
  }
);

// Only listen in development
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🔗 CORS allowed origins: ${allowedOrigins.join(", ")}`);
    console.log(
      `🗄️  Database: ${process.env.DATABASE_URL ? "configured" : "not configured"}`
    );
  });
}

export default app;
