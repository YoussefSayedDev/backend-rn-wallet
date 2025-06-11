import dotenv from "dotenv";
import express from "express";
import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
app.use(rateLimiter);
app.use(express.json());

// Cron Jobs
import cron from "./config/cron.js";

if (process.env.NODE_ENV === "production") {
  cron.start();
}

// Routes
import transactionRoutes from "./routes/transaction.routes.js";
app.use("/api/transactions", transactionRoutes);

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
  res.send("OK");
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is up and runnin on PORT: ${PORT}`);
  });
});
