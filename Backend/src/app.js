import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import resumeRouter from "./routes/resume.routes.js";
import cors from "cors";
import compression from "compression";
import { config } from "dotenv";

config();

const app = express();

// Compression middleware for response compression
app.use(compression());

// Rate limiting middleware (100 requests per second)
const rateLimit = (req, res, next) => {
  const now = Date.now();
  if (!req.ip) {
    req.ip = req.connection.remoteAddress;
  }
  
  // Initialize rate limit store if it doesn't exist
  if (!global.rateLimitStore) {
    global.rateLimitStore = {};
  }
  
  const ip = req.ip;
  const currentSecond = Math.floor(now / 1000);
  const key = `${ip}:${currentSecond}`;
  
  if (!global.rateLimitStore[key]) {
    global.rateLimitStore[key] = 0;
  }
  
  global.rateLimitStore[key]++;
  
  if (global.rateLimitStore[key] > 100) {
    return res.status(429).json({ message: "Rate limit exceeded" });
  }
  
  // Clean up old entries (older than 10 seconds)
  const cutoff = currentSecond - 10;
  for (const existingKey in global.rateLimitStore) {
    const [, second] = existingKey.split(':');
    if (parseInt(second) < cutoff) {
      delete global.rateLimitStore[existingKey];
    }
  }
  
  next();
};

app.use(rateLimit);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: [process.env.ALLOWED_SITE],
    credentials: true
};

app.use(cors(corsOptions));

app.use("/api/users", userRouter);
app.use("/api/resumes", resumeRouter);

// Root route: redirect to API resume start route to avoid "Cannot GET /"
app.get('/', (req, res) => {
  return res.redirect('/api/resumes/');
});

export default app;
